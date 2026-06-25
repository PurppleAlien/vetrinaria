import { redirect } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PatientForm } from '@/components/patient-form';
import { createPatient } from '@/lib/actions/patients';

export default function NewPatientPage() {
  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Nuevo Paciente</h1>
        <p className="text-muted-foreground">Registra una nueva mascota</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Datos del Paciente</CardTitle>
        </CardHeader>
        <CardContent>
          <PatientForm
            onSubmit={async (data) => {
              'use server';
              await createPatient(data);
              redirect('/patients');
            }}
            submitLabel="Crear Paciente"
          />
        </CardContent>
      </Card>
    </div>
  );
}
