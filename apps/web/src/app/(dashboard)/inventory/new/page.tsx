import { redirect } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ProductForm } from '@/components/product-form';
import { createProduct } from '@/lib/actions/products';

export default function NewProductPage() {
  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div><h1 className="text-3xl font-bold tracking-tight">Nuevo Producto</h1><p className="text-muted-foreground">Agregar al inventario</p></div>
      <Card><CardHeader><CardTitle>Datos del Producto</CardTitle></CardHeader>
        <CardContent>
          <ProductForm onSubmit={async (data) => { 'use server'; await createProduct(data); redirect('/inventory'); }} submitLabel="Crear Producto" />
        </CardContent>
      </Card>
    </div>
  );
}
