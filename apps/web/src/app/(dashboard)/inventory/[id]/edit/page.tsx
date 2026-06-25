import Link from 'next/link'; import { notFound, redirect } from 'next/navigation';
import { Button } from '@/components/ui/button'; import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ProductForm } from '@/components/product-form'; import { getProduct, updateProduct } from '@/lib/actions/products';
import { ArrowLeft } from 'lucide-react';

interface Props { params: Promise<{ id: string }> }
export default async function EditProductPage({ params }: Props) {
  const { id } = await params; const pid = Number(id); const product = await getProduct(pid);
  if (!product) notFound();
  return (<div className="mx-auto max-w-2xl space-y-6">
    <div className="flex items-center gap-4">
      <Button variant="ghost" size="icon" asChild><Link href={`/inventory/${pid}`}><ArrowLeft className="h-4 w-4" /></Link></Button>
      <div><h1 className="text-3xl font-bold tracking-tight">Editar Producto</h1><p className="text-muted-foreground">{product.name}</p></div>
    </div>
    <Card><CardHeader><CardTitle>Datos del Producto</CardTitle></CardHeader>
      <CardContent>
        <ProductForm defaultValues={{ name: product.name, description: product.description || '', type: product.type, sku: product.sku || '', price: product.price, costPrice: product.costPrice || '', stockQuantity: product.stockQuantity, reorderPoint: product.reorderPoint ?? 10 }}
          onSubmit={async (data) => { 'use server'; await updateProduct(pid, data); redirect(`/inventory/${pid}`); }} submitLabel="Actualizar Producto" />
      </CardContent>
    </Card>
  </div>);
}
