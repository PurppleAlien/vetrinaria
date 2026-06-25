import Link from 'next/link';
import { notFound } from 'next/navigation';
import { redirect } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AppointmentForm } from '@/components/appointment-form';
import { getAppointment, updateAppointment } from '@/lib/actions/appointments';
import { ArrowLeft } from 'lucide-react';

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditAppointmentPage({ params }: Props) {
  const { id } = await params;
  const aptId = Number(id);
  const apt = await getAppointment(aptId);

  if (!apt) notFound();

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href={`/appointments/${aptId}`}>
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Editar Cita</h1>
          <p className="text-muted-foreground">{apt.patientName}</p>
        </div>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Detalles de la Cita</CardTitle>
        </CardHeader>
        <CardContent>
          <AppointmentForm
            defaultValues={{
              clientId: apt.clientId,
              patientId: apt.patientId,
              vetId: apt.vetId,
              date: apt.date,
              startTime: apt.startTime,
              endTime: apt.endTime,
              type: apt.type,
              notes: apt.notes || '',
              room: apt.room || '',
            }}
            onSubmit={async (data) => {
              'use server';
              await updateAppointment(aptId, data);
              redirect(`/appointments/${aptId}`);
            }}
            submitLabel="Actualizar Cita"
          />
        </CardContent>
      </Card>
    </div>
  );
}
