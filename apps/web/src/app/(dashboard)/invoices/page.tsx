import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Receipt } from 'lucide-react';
import { getInvoices, updateInvoiceStatus } from '@/lib/actions/invoices';

const statusLabels: Record<string, string> = { draft: 'Borrador', issued: 'Emitida', paid: 'Pagada', cancelled: 'Cancelada' };
const statusColors: Record<string, string> = {
  draft: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200',
  issued: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  paid: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  cancelled: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
};

export default async function InvoicesPage() {
  const invoices = await getInvoices();

  return (<div className="space-y-6">
    <div className="flex items-center justify-between">
      <div><h1 className="text-3xl font-bold tracking-tight">Facturación</h1><p className="text-muted-foreground">Facturas emitidas</p></div>
      <Button asChild><Link href="/invoices/new"><Plus className="mr-2 h-4 w-4" />Nueva Factura</Link></Button>
    </div>

    {invoices.length === 0 ? (
      <Card><CardContent className="flex flex-col items-center gap-2 py-12 text-center">
        <Receipt className="h-12 w-12 text-muted-foreground/50" />
        <p className="text-muted-foreground">No hay facturas emitidas.</p>
        <Button asChild variant="outline" size="sm"><Link href="/invoices/new">Crear primera factura</Link></Button>
      </CardContent></Card>
    ) : (
      <Card>
        <CardHeader><CardTitle className="text-lg font-medium">{invoices.length} facturas</CardTitle></CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="border-b text-left text-muted-foreground">
                <th className="pb-3 font-medium">Folio</th><th className="pb-3 font-medium">Cliente</th>
                <th className="pb-3 font-medium">Total</th><th className="pb-3 font-medium">Estado</th>
                <th className="pb-3 font-medium">Fecha</th><th />
              </tr></thead>
              <tbody>
                {invoices.map((inv) => (
                  <tr key={inv.id} className="border-b last:border-0">
                    <td className="py-3"><Link href={`/invoices/${inv.id}`} className="font-mono text-xs hover:underline">{inv.invoiceNumber}</Link></td>
                    <td className="py-3">{inv.clientName}</td>
                    <td className="py-3 font-medium">${inv.total}</td>
                    <td className="py-3"><span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${statusColors[inv.status]}`}>{statusLabels[inv.status]}</span></td>
                    <td className="py-3 text-muted-foreground">{new Date(inv.createdAt).toLocaleDateString('es-ES')}</td>
                    <td className="py-3 text-right">
                      <div className="flex gap-1 justify-end">
                        {inv.status === 'draft' && (
                          <form action={async () => { 'use server'; await updateInvoiceStatus(inv.id, 'issued'); }}>
                            <button type="submit" className="rounded bg-blue-100 px-2 py-0.5 text-[10px] font-medium text-blue-800 dark:bg-blue-900 dark:text-blue-200 hover:opacity-80">Emitir</button>
                          </form>
                        )}
                        {inv.status === 'issued' && (
                          <form action={async () => { 'use server'; await updateInvoiceStatus(inv.id, 'paid'); }}>
                            <button type="submit" className="rounded bg-green-100 px-2 py-0.5 text-[10px] font-medium text-green-800 dark:bg-green-900 dark:text-green-200 hover:opacity-80">Pagar</button>
                          </form>
                        )}
                        <Button asChild variant="ghost" size="sm"><Link href={`/invoices/${inv.id}`}>Ver</Link></Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    )}
  </div>);
}
