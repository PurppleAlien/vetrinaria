import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Plus, Building2 } from 'lucide-react';
import { getSuppliers } from '@/lib/actions/suppliers';

export default async function SuppliersPage() {
  const suppliers = await getSuppliers();
  return (<div className="space-y-6">
    <div className="flex items-center justify-between">
      <div><h1 className="text-3xl font-bold tracking-tight">Proveedores</h1><p className="text-muted-foreground">Gestión de proveedores</p></div>
      <Button asChild><Link href="/suppliers/new"><Plus className="mr-2 h-4 w-4" />Nuevo Proveedor</Link></Button>
    </div>
    {suppliers.length === 0 ? (
      <Card><CardContent className="flex flex-col items-center gap-2 py-12 text-center">
        <Building2 className="h-12 w-12 text-muted-foreground/50" />
        <p className="text-muted-foreground">No hay proveedores registrados.</p>
        <Button asChild variant="outline" size="sm"><Link href="/suppliers/new">Agregar proveedor</Link></Button>
      </CardContent></Card>
    ) : (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {suppliers.map((s) => (
          <Card key={s.id} className="transition-shadow hover:shadow-md">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <Building2 className="mt-1 h-5 w-5 text-muted-foreground shrink-0" />
                <div className="min-w-0">
                  <Link href={`/suppliers/${s.id}`} className="font-medium hover:underline">{s.name}</Link>
                  {s.contact && <p className="text-xs text-muted-foreground">{s.contact}</p>}
                  {s.phone && <p className="text-xs text-muted-foreground">{s.phone}</p>}
                  {s.email && <p className="text-xs text-muted-foreground truncate">{s.email}</p>}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )}
  </div>);
}
