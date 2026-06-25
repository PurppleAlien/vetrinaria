import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Syringe, Calendar, User, ArrowLeft, PawPrint, ShieldCheck, AlertTriangle } from 'lucide-react';
import { getVaccinations } from '@/lib/actions/vaccinations';
import { getPatient, getPatients } from '@/lib/actions/patients';

const speciesLabels: Record<string, string> = {
  dog: 'Perro', cat: 'Gato', rabbit: 'Conejo',
  bird: 'Ave', reptile: 'Reptil', other: 'Otro',
};

interface Props {
  searchParams?: Promise<{ patientId?: string }>;
}

export default async function VaccinationsPage({ searchParams }: Props) {
  const sp = await searchParams;
  const patientId = Number(sp?.patientId);

  if (!patientId) {
    const patients = await getPatients();
    const summaries = await getVaccinations() as any[];

    const summaryMap = new Map(summaries.map(s => [s.patientId, s]));

    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Vacunación</h1>
          <p className="text-muted-foreground">Registro de vacunas aplicadas a los pacientes</p>
        </div>
        {patients.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center gap-2 py-12 text-center">
              <Syringe className="h-12 w-12 text-muted-foreground/50" />
              <p className="text-muted-foreground">No hay pacientes registrados.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {patients.map((p) => {
              const s = summaryMap.get(p.id);
              const isOverdue = s?.nextDueDate && new Date(s.nextDueDate) < new Date();
              return (
                <Card key={p.id} className="transition-shadow hover:shadow-md">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <PawPrint className="h-5 w-5 text-primary" />
                      <Link href={`/vaccinations?patientId=${p.id}`} className="hover:underline">
                        {p.name}
                      </Link>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm">
                    <p className="text-muted-foreground">
                      {speciesLabels[p.species] || p.species}
                      {p.breed ? ` · ${p.breed}` : ''}
                      {p.gender === 'male' ? ' · Macho' : ' · Hembra'}
                    </p>
                    <p className="text-xs text-muted-foreground">Dueño: {p.clientName}</p>
                    <div className="flex items-center gap-2 pt-1">
                      {s && s.vaccineCount > 0 ? (
                        <>
                          <ShieldCheck className="h-4 w-4 text-green-600" />
                          <span className="text-xs">{s.vaccineCount} vacuna{s.vaccineCount !== 1 ? 's' : ''}</span>
                          {isOverdue ? (
                            <span className="inline-flex items-center rounded-full bg-red-100 px-2 py-0.5 text-[10px] font-medium text-red-700">Vencida</span>
                          ) : s.nextDueDate ? (
                            <span className="inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
                              Próxima: {new Date(s.nextDueDate).toLocaleDateString('es-ES')}
                            </span>
                          ) : null}
                        </>
                      ) : (
                        <span className="text-xs text-muted-foreground">Sin vacunas registradas</span>
                      )}
                    </div>
                    <div className="pt-2">
                      <Button variant="outline" size="sm" className="w-full" asChild>
                        <Link href={`/vaccinations?patientId=${p.id}`}>
                          <Syringe className="mr-2 h-4 w-4" />
                          Ver vacunas
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    );
  }

  const patient = await getPatient(patientId);
  if (!patient) notFound();

  const records = await getVaccinations(patientId) as any[];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/vaccinations">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Vacunación</h1>
            <p className="text-muted-foreground">
              {patient.name} · {speciesLabels[patient.species] || patient.species}
            </p>
          </div>
        </div>
      </div>

      {records.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center gap-2 py-12 text-center">
            <Syringe className="h-12 w-12 text-muted-foreground/50" />
            <p className="text-muted-foreground">No hay vacunas registradas para este paciente.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {records.map((r) => {
            const isOverdue = r.nextDueDate && new Date(r.nextDueDate) < new Date();
            return (
              <Card key={r.id} className="transition-shadow hover:shadow-md">
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                      <Syringe className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-medium">{r.vaccineName}</p>
                        {isOverdue ? (
                          <span className="inline-flex items-center rounded-full bg-red-100 px-2 py-0.5 text-[10px] font-medium text-red-700">Vencida</span>
                        ) : r.nextDueDate ? (
                          <span className="inline-flex items-center rounded-full bg-green-100 px-2 py-0.5 text-[10px] font-medium text-green-700">Al día</span>
                        ) : null}
                      </div>
                      <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground mt-1">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          Aplicada: {new Date(r.appliedDate).toLocaleDateString('es-ES')}
                        </span>
                        {r.nextDueDate && (
                          <span className="flex items-center gap-1">
                            <AlertTriangle className="h-3 w-3" />
                            Próxima: {new Date(r.nextDueDate).toLocaleDateString('es-ES')}
                          </span>
                        )}
                        {r.doseNumber && (
                          <span>Dosis #{r.doseNumber}</span>
                        )}
                        {r.batchNumber && (
                          <span>Lote: {r.batchNumber}</span>
                        )}
                        {r.administeredByName && (
                          <span className="flex items-center gap-1">
                            <User className="h-3 w-3" />
                            {r.administeredByName}
                          </span>
                        )}
                      </div>
                      {r.notes && (
                        <p className="text-xs text-muted-foreground mt-1">{r.notes}</p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
