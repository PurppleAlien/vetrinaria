import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getProduct } from '@/lib/actions/products';
import { ArrowLeft, Edit, Package, Tag, DollarSign, Box, AlertTriangle } from 'lucide-react';

interface Props { params: Promise<{ id: string }> }

const typeLabels: Record<string, string> = {
  medication: 'Medicamento', supply: 'Insumo', food: 'Alimento', service: 'Servicio',
};

export default async function ProductDetailPage({ params }: Props) {
  const { id } = await params;
  const product = await getProduct(Number(id));
  if (!product) notFound();

  const details = [
    { label: 'Tipo', value: typeLabels[product.type] || product.type, icon: Tag },
    { label: 'SKU', value: product.sku || '—', icon: Package },
    { label: 'Precio venta', value: `$${product.price}`, icon: DollarSign },
    { label: 'Precio costo', value: product.costPrice ? `$${product.costPrice}` : '—', icon: DollarSign },
    { label: 'Stock', value: String(product.stockQuantity), icon: Box },
    { label: 'Stock mínimo', value: String(product.reorderPoint ?? 10), icon: AlertTriangle },
  ];

  const isLowStock = Number(product.stockQuantity) <= Number(product.reorderPoint);

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/inventory"><ArrowLeft className="h-4 w-4" /></Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{product.name}</h1>
            <p className="text-muted-foreground">
              {typeLabels[product.type] || product.type}
              {product.sku ? ` · SKU: ${product.sku}` : ''}
            </p>
          </div>
        </div>
        <Button asChild>
          <Link href={`/inventory/${product.id}/edit`}><Edit className="mr-2 h-4 w-4" />Editar</Link>
        </Button>
      </div>

      {isLowStock && (
        <Card className="border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-950">
          <CardContent className="flex items-start gap-3 p-4">
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-600 dark:text-amber-400" />
            <p className="text-sm text-amber-800 dark:text-amber-200 font-medium">Stock bajo ({product.stockQuantity} unidades). Punto de reorden: {product.reorderPoint}</p>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader><CardTitle>Información del Producto</CardTitle></CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            {details.map(({ label, value, icon: Icon }) => (
              <div key={label} className="flex items-start gap-3">
                <Icon className="mt-0.5 h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">{label}</p>
                  <p className="text-sm font-medium">{value}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {product.description && (
        <Card>
          <CardHeader><CardTitle>Descripción</CardTitle></CardHeader>
          <CardContent><p className="text-sm whitespace-pre-wrap">{product.description}</p></CardContent>
        </Card>
      )}
    </div>
  );
}
