import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getAppointment, updateAppointmentStatus } from '@/lib/actions/appointments';
import { ArrowLeft, Edit, Calendar, Clock, User, PawPrint, Stethoscope, DoorOpen, FileText } from 'lucide-react';

interface Props {
  params: Promise<{ id: string }>;
}

const statusLabels: Record<string, string> = {
  scheduled: 'Programada', confirmed: 'Confirmada', checked_in: 'Check-In',
  in_exam: 'En consulta', checked_out: 'Check-Out', cancelled: 'Cancelada',
  no_show: 'No asistió',
};

const statusColors: Record<string, string> = {
  scheduled: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  confirmed: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  checked_in: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
  in_exam: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
  checked_out: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200',
  cancelled: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
  no_show: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
};

const typeLabels: Record<string, string> = {
  consultation: 'Consulta general', vaccination: 'Vacunación', surgery: 'Cirugía',
  emergency: 'Urgencia', grooming: 'Estética', boarding: 'Hospitalización',
  follow_up: 'Seguimiento', other: 'Otro',
};

const statusTransitions: Record<string, string[]> = {
  scheduled: ['confirmed', 'cancelled'],
  confirmed: ['checked_in', 'cancelled'],
  checked_in: ['in_exam'],
  in_exam: ['checked_out'],
  cancelled: [],
  checked_out: [],
  no_show: [],
};

export default async function AppointmentDetailPage({ params }: Props) {
  const { id } = await params;
  const apt = await getAppointment(Number(id));

  if (!apt) notFound();

  const nextStatuses = statusTransitions[apt.status] || [];

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href={`/appointments?date=${apt.date}`}>
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold tracking-tight">
                {apt.patientName}
              </h1>
              <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${statusColors[apt.status]}`}>
                {statusLabels[apt.status] || apt.status}
              </span>
            </div>
            <p className="text-muted-foreground">
              {typeLabels[apt.type] || apt.type}
            </p>
          </div>
        </div>
        <Button asChild>
          <Link href={`/appointments/${apt.id}/edit`}>
            <Edit className="mr-2 h-4 w-4" />
            Editar
          </Link>
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Fecha y Hora</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-3">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">
                {new Date(apt.date + 'T12:00:00').toLocaleDateString('es-ES', {
                  weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
                })}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">
                {apt.startTime.slice(0, 5)} - {apt.endTime.slice(0, 5)}
              </span>
            </div>
            {apt.room && (
              <div className="flex items-center gap-3">
                <DoorOpen className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">Consultorio {apt.room}</span>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Responsables</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-3">
              <User className="h-4 w-4 text-muted-foreground" />
              <div>
                <Link href={`/clients/${apt.clientId}`} className="text-sm font-medium hover:underline">
                  {apt.clientName}
                </Link>
                <p className="text-xs text-muted-foreground">Dueño</p>
              </div>
            </div>
            {apt.vetName && (
              <div className="flex items-center gap-3">
                <Stethoscope className="h-4 w-4 text-muted-foreground" />
                <div>
                  <span className="text-sm font-medium">{apt.vetName} {apt.vetLastName}</span>
                  <p className="text-xs text-muted-foreground">Veterinario</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Paciente</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-3">
            <PawPrint className="h-4 w-4 text-muted-foreground" />
            <div>
              <Link href={`/patients/${apt.patientId}`} className="text-sm font-medium hover:underline">
                {apt.patientName}
              </Link>
              <p className="text-xs text-muted-foreground">
                {apt.patientSpecies}{apt.patientBreed ? ` · ${apt.patientBreed}` : ''}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {apt.notes && (
        <Card>
          <CardHeader>
            <CardTitle>Notas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-start gap-3">
              <FileText className="mt-0.5 h-4 w-4 text-muted-foreground" />
              <p className="text-sm whitespace-pre-wrap">{apt.notes}</p>
            </div>
          </CardContent>
        </Card>
      )}

      {nextStatuses.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Cambiar Estado</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {nextStatuses.map((s) => (
                <form
                  key={s}
                  action={async () => {
                    'use server';
                    await updateAppointmentStatus(apt.id, s);
                  }}
                >
                  <button
                    type="submit"
                    className={`inline-flex items-center rounded-full px-3 py-1.5 text-sm font-medium transition-colors hover:opacity-80 ${statusColors[s]}`}
                  >
                    {statusLabels[s]}
                  </button>
                </form>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
