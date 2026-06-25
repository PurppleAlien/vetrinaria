import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Package } from 'lucide-react';
import { getProducts } from '@/lib/actions/products';

const typeLabels: Record<string, string> = {
  medication: 'Medicamento', supply: 'Insumo', food: 'Alimento', service: 'Servicio',
};

export default async function InventoryPage() {
  const products = await getProducts();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Inventario</h1>
          <p className="text-muted-foreground">Productos y servicios</p>
        </div>
        <Button asChild>
          <Link href="/inventory/new"><Plus className="mr-2 h-4 w-4" />Nuevo Producto</Link>
        </Button>
      </div>

      {products.length === 0 ? (
        <Card><CardContent className="flex flex-col items-center gap-2 py-12 text-center">
          <Package className="h-12 w-12 text-muted-foreground/50" />
          <p className="text-muted-foreground">No hay productos registrados.</p>
          <Button asChild variant="outline" size="sm"><Link href="/inventory/new">Agregar producto</Link></Button>
        </CardContent></Card>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left text-muted-foreground">
                <th className="pb-3 font-medium">Nombre</th>
                <th className="pb-3 font-medium">Tipo</th>
                <th className="pb-3 font-medium">SKU</th>
                <th className="pb-3 font-medium">Precio</th>
                <th className="pb-3 font-medium">Stock</th>
                <th className="pb-3 font-medium" />
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id} className="border-b last:border-0">
                  <td className="py-3"><Link href={`/inventory/${p.id}`} className="font-medium hover:underline">{p.name}</Link></td>
                  <td className="py-3 text-muted-foreground">{typeLabels[p.type] || p.type}</td>
                  <td className="py-3 text-muted-foreground">{p.sku || '—'}</td>
                  <td className="py-3">${p.price}</td>
                  <td className="py-3">
                    <span className={Number(p.stockQuantity) <= Number(p.reorderPoint) ? 'text-destructive font-medium' : ''}>
                      {p.stockQuantity}
                    </span>
                  </td>
                  <td className="py-3 text-right">
                    <Button asChild variant="ghost" size="sm"><Link href={`/inventory/${p.id}`}>Ver</Link></Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
