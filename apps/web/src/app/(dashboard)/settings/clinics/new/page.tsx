import Link from 'next/link'; import { redirect } from 'next/navigation';
import { Button } from '@/components/ui/button'; import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { createClinic } from '@/lib/actions/clinics';
import { ArrowLeft } from 'lucide-react';
import { ClinicForm } from '@/components/clinic-form';

export default function NewClinicPage() {
  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild><Link href="/settings/clinics"><ArrowLeft className="h-4 w-4" /></Link></Button>
        <div><h1 className="text-3xl font-bold tracking-tight">Nueva Clínica</h1><p className="text-muted-foreground">Registrar una nueva clínica</p></div>
      </div>
      <Card><CardHeader><CardTitle>Datos de la Clínica</CardTitle></CardHeader>
        <CardContent>
          <ClinicForm onSubmit={async (data) => { 'use server'; await createClinic(data); redirect('/settings/clinics'); }} submitLabel="Crear Clínica" />
        </CardContent>
      </Card>
    </div>
  );
}
