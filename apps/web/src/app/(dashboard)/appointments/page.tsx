import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, ChevronLeft, ChevronRight, Calendar } from 'lucide-react';
import { getAppointments, updateAppointmentStatus } from '@/lib/actions/appointments';

interface Props {
  searchParams?: Promise<{ date?: string }>;
}

const statusLabels: Record<string, string> = {
  scheduled: 'Programada',
  confirmed: 'Confirmada',
  checked_in: 'Check-In',
  in_exam: 'En consulta',
  checked_out: 'Check-Out',
  cancelled: 'Cancelada',
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
  consultation: 'Consulta', vaccination: 'Vacunación', surgery: 'Cirugía',
  emergency: 'Urgencia', grooming: 'Estética', boarding: 'Hospitalización',
  follow_up: 'Seguimiento', other: 'Otro',
};

function addDays(dateStr: string, days: number) {
  const d = new Date(dateStr);
  d.setDate(d.getDate() + days);
  return d.toISOString().split('T')[0];
}

function todayStr() {
  return new Date().toISOString().split('T')[0];
}

const quickStatuses = ['confirmed', 'checked_in', 'in_exam', 'checked_out', 'cancelled'];

export default async function AppointmentsPage({ searchParams }: Props) {
  const sp = await searchParams;
  const currentDate = sp?.date || todayStr();
  const appointments = await getAppointments(currentDate);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Agenda</h1>
          <p className="text-muted-foreground">Programación de citas</p>
        </div>
        <Button asChild>
          <Link href="/appointments/new">
            <Plus className="mr-2 h-4 w-4" />
            Nueva Cita
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Button variant="outline" size="icon" asChild>
                <Link href={`/appointments?date=${addDays(currentDate, -1)}`}>
                  <ChevronLeft className="h-4 w-4" />
                </Link>
              </Button>
              <CardTitle className="text-base">
                {new Date(currentDate + 'T12:00:00').toLocaleDateString('es-ES', {
                  weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
                })}
              </CardTitle>
              <Button variant="outline" size="icon" asChild>
                <Link href={`/appointments?date=${addDays(currentDate, 1)}`}>
                  <ChevronRight className="h-4 w-4" />
                </Link>
              </Button>
              {currentDate !== todayStr() && (
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/appointments">Hoy</Link>
                </Button>
              )}
            </div>
            <Button variant="outline" size="sm" asChild>
              <Link href={`/appointments?date=${todayStr()}`}>
                <Calendar className="mr-2 h-4 w-4" />
                Hoy
              </Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {appointments.length === 0 ? (
            <div className="flex flex-col items-center gap-2 py-12 text-center">
              <Calendar className="h-12 w-12 text-muted-foreground/50" />
              <p className="text-muted-foreground">
                No hay citas programadas para este día.
              </p>
              <Button asChild variant="outline" size="sm">
                <Link href="/appointments/new">Agendar cita</Link>
              </Button>
            </div>
          ) : (
            <div className="space-y-2">
              {appointments.map((apt) => (
                <div
                  key={apt.id}
                  className="flex flex-wrap items-center gap-3 rounded-lg border p-3 transition-colors hover:bg-muted/50"
                >
                  <div className="min-w-[80px] text-center">
                    <p className="text-sm font-medium">
                      {apt.startTime.slice(0, 5)} - {apt.endTime.slice(0, 5)}
                    </p>
                  </div>
                  <div className="flex-1 min-w-[200px]">
                    <Link
                      href={`/appointments/${apt.id}`}
                      className="font-medium hover:underline"
                    >
                      {apt.patientName}
                    </Link>
                    <p className="text-xs text-muted-foreground">
                      {apt.clientName} · {typeLabels[apt.type] || apt.type}
                      {apt.room ? ` · Sala ${apt.room}` : ''}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {apt.vetName && (
                      <span className="text-xs text-muted-foreground hidden md:inline">
                        {apt.vetName} {apt.vetLastName}
                      </span>
                    )}
                    <span
                      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${statusColors[apt.status]}`}
                    >
                      {statusLabels[apt.status] || apt.status}
                    </span>
                  </div>
                  <div className="flex gap-1">
                    {quickStatuses
                      .filter((s) => s !== apt.status)
                      .slice(0, 2)
                      .map((s) => (
                        <form
                          key={s}
                          action={async () => {
                            'use server';
                            await updateAppointmentStatus(apt.id, s);
                          }}
                        >
                          <button
                            type="submit"
                            className={`rounded px-2 py-0.5 text-[10px] font-medium transition-colors hover:opacity-80 ${statusColors[s]}`}
                          >
                            {statusLabels[s]}
                          </button>
                        </form>
                      ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
