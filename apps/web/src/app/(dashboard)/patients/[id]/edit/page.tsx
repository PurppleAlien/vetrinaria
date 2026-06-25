import Link from 'next/link';
import { notFound } from 'next/navigation';
import { redirect } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PatientForm } from '@/components/patient-form';
import { getPatient, updatePatient } from '@/lib/actions/patients';
import { ArrowLeft } from 'lucide-react';

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditPatientPage({ params }: Props) {
  const { id } = await params;
  const patientId = Number(id);
  const patient = await getPatient(patientId);

  if (!patient) notFound();

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href={`/patients/${patientId}`}>
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Editar Paciente</h1>
          <p className="text-muted-foreground">{patient.name}</p>
        </div>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Datos del Paciente</CardTitle>
        </CardHeader>
        <CardContent>
          <PatientForm
            defaultValues={{
              clientId: patient.clientId,
              name: patient.name,
              species: patient.species,
              breed: patient.breed || '',
              gender: patient.gender,
              birthDate: patient.birthDate || '',
              color: patient.color || '',
              microchip: patient.microchip || '',
              allergies: patient.allergies || '',
              notes: patient.notes || '',
            }}
            onSubmit={async (data) => {
              'use server';
              await updatePatient(patientId, data);
              redirect(`/patients/${patientId}`);
            }}
            submitLabel="Actualizar Paciente"
          />
        </CardContent>
      </Card>
    </div>
  );
}
