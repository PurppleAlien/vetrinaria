import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getInvoice, updateInvoiceStatus } from '@/lib/actions/invoices';
import { ArrowLeft, User, Stethoscope, Download } from 'lucide-react';
import { eq } from 'drizzle-orm';
import { db, schema } from '@vetrinaria/db';

interface Props { params: Promise<{ id: string }> }

const statusLabels: Record<string, string> = { draft: 'Borrador', issued: 'Emitida', paid: 'Pagada', cancelled: 'Cancelada' };
const statusColors: Record<string, string> = {
  draft: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200',
  issued: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  paid: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  cancelled: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
};

export default async function InvoiceDetailPage({ params }: Props) {
  const { id } = await params;
  const inv = await getInvoice(Number(id));
  if (!inv) notFound();

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild><Link href="/invoices"><ArrowLeft className="h-4 w-4" /></Link></Button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold font-mono">{inv.invoiceNumber}</h1>
              <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${statusColors[inv.status]}`}>
                {statusLabels[inv.status]}
              </span>
            </div>
            <p className="text-muted-foreground">{new Date(inv.createdAt).toLocaleDateString('es-ES', { dateStyle: 'long' })}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <a href={`/api/invoices/${inv.id}/pdf`} download>
              <Download className="h-4 w-4 mr-1" /> PDF
            </a>
          </Button>
          {inv.status === 'draft' && (
            <form action={async () => { 'use server'; await updateInvoiceStatus(inv.id, 'issued'); }}>
              <Button type="submit">Emitir Factura</Button>
            </form>
          )}
          {inv.status === 'issued' && (
            <form action={async () => { 'use server'; await updateInvoiceStatus(inv.id, 'paid'); }}>
              <Button type="submit" className="bg-green-600 hover:bg-green-700">Marcar como Pagada</Button>
            </form>
          )}
          {(inv.status === 'draft' || inv.status === 'issued') && (
            <form action={async () => { 'use server'; await updateInvoiceStatus(inv.id, 'cancelled'); }}>
              <Button type="submit" variant="outline">Cancelar Factura</Button>
            </form>
          )}
        </div>
      </div>

      <Card>
        <CardHeader><CardTitle>Cliente</CardTitle></CardHeader>
        <CardContent>
          <div className="flex items-center gap-3">
            <User className="h-4 w-4 text-muted-foreground" />
            <div>
              <Link href={`/clients/${inv.clientId}`} className="font-medium hover:underline">{inv.clientName}</Link>
              {inv.clientPhone && <p className="text-xs text-muted-foreground">{inv.clientPhone}</p>}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Conceptos</CardTitle></CardHeader>
        <CardContent>
          <table className="w-full text-sm">
            <thead><tr className="border-b text-left text-muted-foreground">
              <th className="pb-2 font-medium">Descripción</th>
              <th className="pb-2 font-medium text-right">Cant.</th>
              <th className="pb-2 font-medium text-right">Precio</th>
              <th className="pb-2 font-medium text-right">Total</th>
            </tr></thead>
            <tbody>
              {inv.items.map((item) => (
                <tr key={item.id} className="border-b last:border-0">
                  <td className="py-2">{item.description}</td>
                  <td className="py-2 text-right">{item.quantity}</td>
                  <td className="py-2 text-right">${item.unitPrice}</td>
                  <td className="py-2 text-right font-medium">${item.total}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="border-t mt-3 pt-3 space-y-1 text-sm">
            <div className="flex justify-between"><span>Subtotal</span><span>${inv.subtotal}</span></div>
            <div className="flex justify-between"><span>IVA (16%)</span><span>${inv.tax}</span></div>
            <div className="flex justify-between font-bold text-base"><span>Total</span><span>${inv.total}</span></div>
          </div>
        </CardContent>
      </Card>

      {inv.notes && (
        <Card><CardHeader><CardTitle>Notas</CardTitle></CardHeader>
          <CardContent><p className="text-sm whitespace-pre-wrap">{inv.notes}</p></CardContent>
        </Card>
      )}
    </div>
  );
}
