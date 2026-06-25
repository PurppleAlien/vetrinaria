import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db, schema } from '@vetrinaria/db';
import { eq } from 'drizzle-orm';
import PDFDocument from 'pdfkit';

interface InvoiceItem {
  id: number;
  invoiceId: number;
  description: string;
  quantity: number;
  unitPrice: string;
  total: string;
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await auth();
  if (!session?.user) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  const { id } = await params;
  const invoiceId = Number(id);

  const invoice = await db
    .select({
      id: schema.invoices.id,
      invoiceNumber: schema.invoices.invoiceNumber,
      subtotal: schema.invoices.subtotal,
      tax: schema.invoices.tax,
      total: schema.invoices.total,
      status: schema.invoices.status,
      notes: schema.invoices.notes,
      createdAt: schema.invoices.createdAt,
      clientId: schema.invoices.clientId,
      clientName: schema.clients.name,
      clientPhone: schema.clients.phone,
      clientEmail: schema.clients.email,
      appointmentId: schema.invoices.appointmentId,
      clinicId: schema.invoices.clinicId,
    })
    .from(schema.invoices)
    .innerJoin(schema.clients, eq(schema.invoices.clientId, schema.clients.id))
    .where(eq(schema.invoices.id, invoiceId))
    .then((r) => r[0] ?? null);

  if (!invoice) {
    return new NextResponse('Invoice not found', { status: 404 });
  }

  if (invoice.clinicId !== session.user.clinicId && session.user.role !== 'super_admin') {
    return new NextResponse('Forbidden', { status: 403 });
  }

  const clinic = await db
    .select()
    .from(schema.clinics)
    .where(eq(schema.clinics.id, invoice.clinicId))
    .then((r) => r[0] ?? null);

  const items = await db
    .select()
    .from(schema.invoiceItems)
    .where(eq(schema.invoiceItems.invoiceId, invoiceId));

  const pdfBuffer = await generateInvoicePdf(invoice, clinic, items);

  return new NextResponse(pdfBuffer, {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="factura-${invoice.invoiceNumber}.pdf"`,
    },
  });
}

async function generateInvoicePdf(
  invoice: {
    invoiceNumber: string;
    subtotal: string;
    tax: string;
    total: string;
    status: string;
    notes: string | null;
    createdAt: Date;
    clientName: string;
    clientPhone: string | null;
    clientEmail: string | null;
  },
  clinic: {
    name: string;
    phone: string | null;
    email: string | null;
    address: string | null;
  } | null,
  items: InvoiceItem[],
): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ margin: 50 });
    const chunks: Buffer[] = [];
    doc.on('data', (chunk: Buffer) => chunks.push(chunk));
    doc.on('end', () => resolve(Buffer.concat(chunks)));
    doc.on('error', reject);

    const pageWidth = doc.page.width - 100;
    const rightX = doc.page.width - 50;

    doc.fontSize(22).font('Helvetica-Bold').text('FACTURA', 50, 50);
    doc.fontSize(10).font('Helvetica');

    doc.fontSize(8).fillColor('#666').text('VETERINARIA', 50, 75);

    const clinicName = clinic?.name ?? 'Veterinaria';
    const clinicPhone = clinic?.phone ?? '';
    const clinicEmail = clinic?.email ?? '';
    const clinicAddress = clinic?.address ?? '';

    doc.fontSize(18).font('Helvetica-Bold').fillColor('#000').text(clinicName, 50, 88);

    let clinicInfoY = 112;
    if (clinicAddress) doc.fontSize(9).font('Helvetica').fillColor('#444').text(clinicAddress, 50, clinicInfoY, { width: 250 });
    if (clinicPhone) doc.fontSize(9).font('Helvetica').fillColor('#444').text(`Tel: ${clinicPhone}`, 50, clinicInfoY + (clinicAddress ? 13 : 0));
    if (clinicEmail) doc.fontSize(9).font('Helvetica').fillColor('#444').text(`Email: ${clinicEmail}`, 50, clinicInfoY + (clinicAddress ? 13 : 0) + (clinicPhone ? 13 : 0));

    const statusLabels: Record<string, string> = {
      draft: 'BORRADOR',
      issued: 'EMITIDA',
      paid: 'PAGADA',
      cancelled: 'CANCELADA',
    };
    const statusStr = statusLabels[invoice.status] ?? invoice.status;

    doc.fontSize(10).font('Helvetica').fillColor('#666').text('No. Factura', rightX, 50, { align: 'right' });
    doc.fontSize(16).font('Helvetica-Bold').fillColor('#000').text(invoice.invoiceNumber, rightX, 64, { align: 'right' });

    doc.fontSize(9).font('Helvetica').fillColor('#666').text('Fecha:', rightX, 88, { align: 'right' });
    doc.fontSize(9).font('Helvetica').fillColor('#444').text(
      new Date(invoice.createdAt).toLocaleDateString('es-MX', { year: 'numeric', month: 'long', day: 'numeric' }),
      rightX - 100, 88, { width: 180, align: 'right' },
    );

    doc.fontSize(9).font('Helvetica').fillColor('#666').text('Estado:', rightX, 106, { align: 'right' });

    const statusColors: Record<string, string> = {
      draft: '#9ca3af',
      issued: '#2563eb',
      paid: '#16a34a',
      cancelled: '#dc2626',
    };
    doc.fillColor(statusColors[invoice.status] ?? '#000');
    doc.fontSize(10).font('Helvetica-Bold').text(statusStr, rightX, 118, { align: 'right' });

    const separatorY = 150;
    doc.strokeColor('#ddd').lineWidth(1).moveTo(50, separatorY).lineTo(pageWidth + 50, separatorY).stroke();

    doc.fillColor('#000').font('Helvetica-Bold').fontSize(12).text('Cliente', 50, separatorY + 20);

    const clientInfoY = separatorY + 42;
    doc.font('Helvetica').fontSize(10).fillColor('#333').text(invoice.clientName, 50, clientInfoY);
    if (invoice.clientPhone) {
      doc.fontSize(9).fillColor('#666').text(`Tel: ${invoice.clientPhone}`, 50, clientInfoY + 16);
    }
    if (invoice.clientEmail) {
      doc.fontSize(9).fillColor('#666').text(`Email: ${invoice.clientEmail}`, 50, clientInfoY + 30);
    }

    const tableY = Math.max(clientInfoY + 60, separatorY + 110);

    const tableTop = tableY;
    const colX = [50, 220, 360, 430, 500];
    const colWidths = [170, 140, 70, 70, 70];

    doc.strokeColor('#000').lineWidth(1).rect(50, tableTop, pageWidth, 20).fill('#1f2937');
    doc.fillColor('#fff').font('Helvetica-Bold').fontSize(9);
    doc.text('DESCRIPCIÓN', colX[0] + 5, tableTop + 5, { width: colWidths[0] });
    doc.text('CANT.', colX[2] + 5, tableTop + 5, { width: colWidths[2], align: 'right' });
    doc.text('PRECIO', colX[3] + 5, tableTop + 5, { width: colWidths[3], align: 'right' });
    doc.text('TOTAL', colX[4] + 5, tableTop + 5, { width: colWidths[4], align: 'right' });

    let rowY = tableTop + 20;
    doc.fillColor('#333').font('Helvetica').fontSize(9);

    for (const [i, item] of items.entries()) {
      if (i % 2 === 0) {
        doc.rect(50, rowY, pageWidth, 22).fill('#f9fafb');
      }
      doc.fillColor('#333');
      doc.text(item.description, colX[0] + 5, rowY + 5, { width: colWidths[0] });
      doc.text(String(item.quantity), colX[2] + 5, rowY + 5, { width: colWidths[2], align: 'right' });
      doc.text(`$${Number(item.unitPrice).toFixed(2)}`, colX[3] + 5, rowY + 5, { width: colWidths[3], align: 'right' });
      doc.text(`$${Number(item.total).toFixed(2)}`, colX[4] + 5, rowY + 5, { width: colWidths[4], align: 'right' });
      rowY += 22;
    }

    doc.strokeColor('#ddd').lineWidth(1).moveTo(50, rowY).lineTo(pageWidth + 50, rowY).stroke();

    const totalsY = rowY + 10;
    doc.fontSize(10);
    doc.fillColor('#666').font('Helvetica').text('Subtotal:', rightX - 100, totalsY, { width: 100, align: 'right' });
    doc.fillColor('#333').font('Helvetica').text(`$${Number(invoice.subtotal).toFixed(2)}`, rightX, totalsY, { width: 100, align: 'right' });

    doc.fillColor('#666').font('Helvetica').text('IVA (16%):', rightX - 100, totalsY + 18, { width: 100, align: 'right' });
    doc.fillColor('#333').font('Helvetica').text(`$${Number(invoice.tax).toFixed(2)}`, rightX, totalsY + 18, { width: 100, align: 'right' });

    doc.strokeColor('#000').lineWidth(1.5).moveTo(rightX - 100, totalsY + 40).lineTo(rightX, totalsY + 40).stroke();

    doc.fillColor('#000').font('Helvetica-Bold').fontSize(13).text('TOTAL:', rightX - 100, totalsY + 46, { width: 100, align: 'right' });
    doc.fillColor('#000').font('Helvetica-Bold').fontSize(13).text(`$${Number(invoice.total).toFixed(2)}`, rightX, totalsY + 46, { width: 100, align: 'right' });

    if (invoice.notes) {
      const notesY = totalsY + 90;
      doc.strokeColor('#ddd').lineWidth(1).moveTo(50, notesY).lineTo(pageWidth + 50, notesY).stroke();
      doc.fontSize(10).font('Helvetica-Bold').fillColor('#000').text('Notas:', 50, notesY + 10);
      doc.fontSize(9).font('Helvetica').fillColor('#666').text(invoice.notes, 50, notesY + 28, { width: pageWidth });
    }

    const footerY = doc.page.height - 70;
    doc.strokeColor('#ddd').lineWidth(1).moveTo(50, footerY).lineTo(pageWidth + 50, footerY).stroke();
    doc.fontSize(8).font('Helvetica').fillColor('#999').text(
      `Factura generada electrónicamente | ${clinicName} | RFC en trámite`,
      50, footerY + 10, { align: 'center', width: pageWidth },
    );

    doc.end();
  });
}
