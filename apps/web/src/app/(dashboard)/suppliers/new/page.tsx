import { redirect } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { SupplierForm } from '@/components/supplier-form';
import { createSupplier } from '@/lib/actions/suppliers';

export default function NewSupplierPage() {
  return (<div className="mx-auto max-w-2xl space-y-6">
    <div><h1 className="text-3xl font-bold tracking-tight">Nuevo Proveedor</h1><p className="text-muted-foreground">Registrar un proveedor</p></div>
    <Card><CardHeader><CardTitle>Datos del Proveedor</CardTitle></CardHeader>
      <CardContent>
        <SupplierForm onSubmit={async (data) => { 'use server'; await createSupplier(data); redirect('/suppliers'); }} submitLabel="Crear Proveedor" />
      </CardContent>
    </Card>
  </div>);
}
