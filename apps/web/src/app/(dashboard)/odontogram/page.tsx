import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Heart, PawPrint } from 'lucide-react';
import { getPatients } from '@/lib/actions/patients';
import { getLatestDentalRecord } from '@/lib/actions/dental-records';

const speciesLabels: Record<string, string> = {
  dog: 'Perro', cat: 'Gato', rabbit: 'Conejo',
  bird: 'Ave', reptile: 'Reptil', other: 'Otro',
};

export default async function OdontogramListPage() {
  const patients = await getPatients();

  const dentalSummaries = await Promise.all(
    patients.map(async (p) => {
      const record = await getLatestDentalRecord(p.id);
      const issues = record?.teeth?.filter((t) => t.status !== 'healthy') ?? [];
      return { patientId: p.id, issueCount: issues.length };
    }),
  );

  const summaryMap = Object.fromEntries(
    dentalSummaries.map((s) => [s.patientId, s.issueCount]),
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Odontograma</h1>
        <p className="text-muted-foreground">Registro de salud dental de los pacientes</p>
      </div>

      {patients.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center gap-2 py-12 text-center">
            <Heart className="h-12 w-12 text-muted-foreground/50" />
            <p className="text-muted-foreground">No hay pacientes registrados.</p>
            <Button asChild variant="outline" size="sm">
              <Link href="/patients/new">Registrar primer paciente</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {patients.map((p) => {
            const issues = summaryMap[p.id] ?? 0;
            return (
              <Card key={p.id} className="transition-shadow hover:shadow-md">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <PawPrint className="h-5 w-5 text-primary" />
                    <Link href={`/odontogram/${p.id}`} className="hover:underline">
                      {p.name}
                    </Link>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-1 text-sm">
                  <p className="text-muted-foreground">
                    {speciesLabels[p.species] || p.species}
                    {p.breed ? ` · ${p.breed}` : ''}
                  </p>
                  <p className="text-muted-foreground">
                    Dueño:{' '}
                    <Link href={`/clients/${p.clientId}`} className="font-medium hover:underline">
                      {p.clientName}
                    </Link>
                  </p>
                  <div className="flex items-center gap-2 pt-1">
                    {issues === 0 ? (
                      <span className="text-xs text-green-600">Sin problemas dentales</span>
                    ) : (
                      <span className="text-xs text-amber-600">{issues} diente(s) con observaciones</span>
                    )}
                  </div>
                  <div className="pt-2">
                    <Button variant="outline" size="sm" className="w-full" asChild>
                      <Link href={`/odontogram/${p.id}`}>
                        <Heart className="mr-2 h-4 w-4" />
                        Ver Odontograma
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
