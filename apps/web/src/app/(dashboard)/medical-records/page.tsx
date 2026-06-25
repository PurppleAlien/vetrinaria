import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, FileText, Calendar, User, ArrowLeft, PawPrint } from 'lucide-react';
import { getMedicalRecords } from '@/lib/actions/medical-records';
import { getPatient, getPatients } from '@/lib/actions/patients';

const speciesLabels: Record<string, string> = {
  dog: 'Perro', cat: 'Gato', rabbit: 'Conejo',
  bird: 'Ave', reptile: 'Reptil', other: 'Otro',
};

interface Props {
  searchParams?: Promise<{ patientId?: string }>;
}

export default async function MedicalRecordsPage({ searchParams }: Props) {
  const sp = await searchParams;
  const patientId = Number(sp?.patientId);

  if (!patientId) {
    const patients = await getPatients();
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Historial Clínico</h1>
          <p className="text-muted-foreground">Selecciona un paciente para ver su historial</p>
        </div>
        {patients.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center gap-2 py-12 text-center">
              <FileText className="h-12 w-12 text-muted-foreground/50" />
              <p className="text-muted-foreground">No hay pacientes registrados.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {patients.map((p) => (
              <Card key={p.id} className="transition-shadow hover:shadow-md">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <PawPrint className="h-5 w-5 text-primary" />
                    <Link href={`/medical-records?patientId=${p.id}`} className="hover:underline">
                      {p.name}
                    </Link>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-1 text-sm">
                  <p className="text-muted-foreground">
                    {speciesLabels[p.species] || p.species}
                    {p.breed ? ` · ${p.breed}` : ''}
                    {p.gender === 'male' ? ' · Macho' : ' · Hembra'}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Dueño: {p.clientName}
                  </p>
                  <div className="pt-2">
                    <Button variant="outline" size="sm" className="w-full" asChild>
                      <Link href={`/medical-records?patientId=${p.id}`}>
                        <FileText className="mr-2 h-4 w-4" />
                        Ver historial
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    );
  }

  const patient = await getPatient(patientId);
  if (!patient) notFound();

  const records = await getMedicalRecords(patientId);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href={`/patients/${patientId}`}>
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Historial Clínico</h1>
            <p className="text-muted-foreground">
              {patient.name} · {patient.species}
            </p>
          </div>
        </div>
        <Button asChild>
          <Link href={`/medical-records/new?patientId=${patientId}`}>
            <Plus className="mr-2 h-4 w-4" />
            Nuevo Registro
          </Link>
        </Button>
      </div>

      {records.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center gap-2 py-12 text-center">
            <FileText className="h-12 w-12 text-muted-foreground/50" />
            <p className="text-muted-foreground">No hay registros clínicos para este paciente.</p>
            <Button asChild variant="outline" size="sm">
              <Link href={`/medical-records/new?patientId=${patientId}`}>Crear primer registro</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {records.map((r) => (
            <Card key={r.id} className="transition-shadow hover:shadow-md">
              <Link href={`/medical-records/${r.id}`}>
                <CardContent className="flex items-center gap-4 p-4">
                  <FileText className="h-8 w-8 text-muted-foreground" />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{r.diagnosis || 'Sin diagnóstico'}</p>
                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(r.createdAt).toLocaleDateString('es-ES')}
                      </span>
                      {r.appointmentDate && (
                        <span className="flex items-center gap-1">
                          Cita: {r.appointmentDate}
                        </span>
                      )}
                      {r.createdByName && (
                        <span className="flex items-center gap-1">
                          <User className="h-3 w-3" />
                          {r.createdByName} {r.createdByLastName}
                        </span>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Link>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
