import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, PawPrint } from 'lucide-react';
import { getPatients } from '@/lib/actions/patients';

const speciesLabels: Record<string, string> = {
  dog: 'Perro', cat: 'Gato', rabbit: 'Conejo',
  bird: 'Ave', reptile: 'Reptil', other: 'Otro',
};

export default async function PatientsPage() {
  const patients = await getPatients();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Pacientes</h1>
          <p className="text-muted-foreground">Gestiona las mascotas registradas</p>
        </div>
        <Button asChild>
          <Link href="/patients/new">
            <Plus className="mr-2 h-4 w-4" />
            Nuevo Paciente
          </Link>
        </Button>
      </div>

      {patients.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center gap-2 py-12 text-center">
            <PawPrint className="h-12 w-12 text-muted-foreground/50" />
            <p className="text-muted-foreground">No hay pacientes registrados.</p>
            <Button asChild variant="outline" size="sm">
              <Link href="/patients/new">Registrar primer paciente</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {patients.map((p) => (
            <Card key={p.id} className="transition-shadow hover:shadow-md">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <PawPrint className="h-5 w-5 text-primary" />
                  <Link href={`/patients/${p.id}`} className="hover:underline">
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
                <p className="text-muted-foreground">
                  Dueño:{' '}
                  <Link href={`/clients/${p.clientId}`} className="font-medium hover:underline">
                    {p.clientName}
                  </Link>
                </p>
                <p className="text-xs text-muted-foreground">
                  Registrado {new Date(p.createdAt).toLocaleDateString('es-ES')}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
