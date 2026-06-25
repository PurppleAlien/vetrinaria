import { redirect } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AppointmentForm } from '@/components/appointment-form';
import { createAppointment } from '@/lib/actions/appointments';

export default function NewAppointmentPage() {
  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Nueva Cita</h1>
        <p className="text-muted-foreground">Programa una nueva consulta veterinaria</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Detalles de la Cita</CardTitle>
        </CardHeader>
        <CardContent>
          <AppointmentForm
            onSubmit={async (data) => {
              'use server';
              await createAppointment(data);
              redirect(`/appointments?date=${data.date}`);
            }}
            submitLabel="Crear Cita"
          />
        </CardContent>
      </Card>
    </div>
  );
}
