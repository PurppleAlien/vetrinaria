import Link from 'next/link'; import { notFound, redirect } from 'next/navigation';
import { Button } from '@/components/ui/button'; import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getClinic, updateClinic } from '@/lib/actions/clinics';
import { ArrowLeft } from 'lucide-react';
import { ClinicForm } from '@/components/clinic-form';

interface Props { params: Promise<{ id: string }> }
export default async function EditClinicPage({ params }: Props) {
  const { id } = await params; const cid = Number(id); const clinic = await getClinic(cid);
  if (!clinic) notFound();
  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild><Link href="/settings/clinics"><ArrowLeft className="h-4 w-4" /></Link></Button>
        <div><h1 className="text-3xl font-bold tracking-tight">Editar Clínica</h1><p className="text-muted-foreground">{clinic.name}</p></div>
      </div>
      <Card><CardHeader><CardTitle>Datos de la Clínica</CardTitle></CardHeader>
        <CardContent>
          <ClinicForm defaultValues={{ name: clinic.name, slug: clinic.slug, email: clinic.email || '', phone: clinic.phone || '', address: clinic.address || '' }}
            onSubmit={async (data) => { 'use server'; await updateClinic(cid, data); redirect('/settings/clinics'); }} submitLabel="Actualizar Clínica" />
        </CardContent>
      </Card>
    </div>
  );
}
