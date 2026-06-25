import Link from 'next/link'; import { notFound, redirect } from 'next/navigation';
import { Button } from '@/components/ui/button'; import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { SupplierForm } from '@/components/supplier-form'; import { getSupplier, updateSupplier } from '@/lib/actions/suppliers';
import { ArrowLeft } from 'lucide-react';

interface Props { params: Promise<{ id: string }> }
export default async function EditSupplierPage({ params }: Props) {
  const { id } = await params; const sid = Number(id); const supplier = await getSupplier(sid);
  if (!supplier) notFound();
  return (<div className="mx-auto max-w-2xl space-y-6">
    <div className="flex items-center gap-4">
      <Button variant="ghost" size="icon" asChild><Link href={`/suppliers/${sid}`}><ArrowLeft className="h-4 w-4" /></Link></Button>
      <div><h1 className="text-3xl font-bold tracking-tight">Editar Proveedor</h1><p className="text-muted-foreground">{supplier.name}</p></div>
    </div>
    <Card><CardHeader><CardTitle>Datos del Proveedor</CardTitle></CardHeader>
      <CardContent>
        <SupplierForm defaultValues={{ name: supplier.name, contact: supplier.contact || '', email: supplier.email || '', phone: supplier.phone || '', address: supplier.address || '' }}
          onSubmit={async (data) => { 'use server'; await updateSupplier(sid, data); redirect(`/suppliers/${sid}`); }} submitLabel="Actualizar Proveedor" />
      </CardContent>
    </Card>
  </div>);
}
