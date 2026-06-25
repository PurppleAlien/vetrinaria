import { redirect } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MedicalRecordForm } from '@/components/medical-record-form';
import { createMedicalRecord } from '@/lib/actions/medical-records';

interface Props {
  searchParams?: Promise<{ patientId?: string; appointmentId?: string }>;
}

export default async function NewMedicalRecordPage({ searchParams }: Props) {
  const sp = await searchParams;
  const patientId = Number(sp?.patientId);
  const appointmentId = sp?.appointmentId ? Number(sp.appointmentId) : undefined;

  if (!patientId) {
    return (
      <div className="mx-auto max-w-2xl space-y-6 text-center py-12">
        <p className="text-muted-foreground">Debes seleccionar un paciente desde su perfil.</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Nuevo Registro Clínico</h1>
        <p className="text-muted-foreground">SOAP + constantes vitales</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Registro SOAP</CardTitle>
        </CardHeader>
        <CardContent>
          <MedicalRecordForm
            patientId={patientId}
            defaultValues={appointmentId ? { appointmentId } : undefined}
            onSubmit={async (data) => {
              'use server';
              await createMedicalRecord(data);
              redirect(`/medical-records?patientId=${patientId}`);
            }}
            submitLabel="Crear Registro"
          />
        </CardContent>
      </Card>
    </div>
  );
}
