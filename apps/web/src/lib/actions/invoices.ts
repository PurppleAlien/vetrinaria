'use server';

import { db, schema } from '@vetrinaria/db';
import { eq, and, desc } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { notifyNewInvoice } from './notifications';
import { getCurrentClinicId } from '@/lib/clinic';

export interface InvoiceInput {
  clientId: number;
  appointmentId: number | null;
  items: { description: string; quantity: number; unitPrice: string }[];
  notes: string;
}

export async function getInvoices() {
  const clinicId = await getCurrentClinicId();
  return db
    .select({
      id: schema.invoices.id,
      invoiceNumber: schema.invoices.invoiceNumber,
      subtotal: schema.invoices.subtotal,
      tax: schema.invoices.tax,
      total: schema.invoices.total,
      status: schema.invoices.status,
      createdAt: schema.invoices.createdAt,
      clientName: schema.clients.name,
    })
    .from(schema.invoices)
    .innerJoin(schema.clients, eq(schema.invoices.clientId, schema.clients.id))
    .where(eq(schema.invoices.clinicId, clinicId))
    .orderBy(desc(schema.invoices.createdAt));
}

export async function getInvoice(id: number) {
  const clinicId = await getCurrentClinicId();
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
      appointmentId: schema.invoices.appointmentId,
    })
    .from(schema.invoices)
    .innerJoin(schema.clients, eq(schema.invoices.clientId, schema.clients.id))
    .where(eq(schema.invoices.id, id))
    .then((r) => r[0] ?? null);
  if (!invoice) return null;

  if (!invoice) return null;

  const items = await db
    .select()
    .from(schema.invoiceItems)
    .where(eq(schema.invoiceItems.invoiceId, id));

  return { ...invoice, items };
}

async function nextInvoiceNumber(): Promise<string> {
  const last = await db
    .select({ num: schema.invoices.invoiceNumber })
    .from(schema.invoices)
    .orderBy(desc(schema.invoices.invoiceNumber))
    .limit(1)
    .then((r) => r[0]?.num);

  const nextNum = last ? String(Number(last.replace('INV-', '')) + 1).padStart(6, '0') : '000001';
  return `INV-${nextNum}`;
}

export async function createInvoice(data: InvoiceInput) {
  const clinicId = await getCurrentClinicId();
  const invoiceNumber = await nextInvoiceNumber();

  const subtotal = data.items.reduce(
    (sum, item) => sum + Number(item.unitPrice) * item.quantity,
    0,
  );
  const tax = Math.round(subtotal * 0.16 * 100) / 100;
  const total = subtotal + tax;

  await db.insert(schema.invoices).values({
    clinicId,
    clientId: data.clientId,
    appointmentId: data.appointmentId || null,
    invoiceNumber,
    subtotal: String(subtotal),
    tax: String(tax),
    total: String(total),
    status: 'draft',
    notes: data.notes || null,
  });

  const invoice = await db
    .select({ id: schema.invoices.id })
    .from(schema.invoices)
    .where(eq(schema.invoices.invoiceNumber, invoiceNumber))
    .then((r) => r[0]);

  if (invoice && data.items.length > 0) {
    await db.insert(schema.invoiceItems).values(
      data.items.map((item) => ({
        invoiceId: invoice.id,
        description: item.description,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        total: String(Number(item.unitPrice) * item.quantity),
      })),
    );
  }

  // Notify admins in same clinic
  const users = await db
    .select({ id: schema.users.id })
    .from(schema.users)
    .where(
      eq(schema.users.role, 'admin'),
    );
  const client = await db
    .select({ name: schema.clients.name })
    .from(schema.clients)
    .where(eq(schema.clients.id, data.clientId))
    .then(r => r[0]);

  await notifyNewInvoice({
    invoiceNumber,
    clientName: client?.name ?? 'Cliente',
    total: String(total),
    userIds: users.map(u => u.id),
  });

  revalidatePath('/invoices');
  return invoice?.id;
}

export async function updateInvoiceStatus(id: number, status: string) {
  await db
    .update(schema.invoices)
    .set({ status: status as any })
    .where(eq(schema.invoices.id, id));
  revalidatePath('/invoices');
  revalidatePath(`/invoices/${id}`);
}
