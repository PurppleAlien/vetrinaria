import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, PawPrint } from 'lucide-react';
import { getPatient } from '@/lib/actions/patients';
import { getLatestDentalRecord } from '@/lib/actions/dental-records';
import { OdontogramClient } from './odontogram-client';

interface Props {
  params: Promise<{ id: string }>;
}

export default async function OdontogramPage({ params }: Props) {
  const { id } = await params;
  const patient = await getPatient(Number(id));
  if (!patient) notFound();

  const dentalRecord = await getLatestDentalRecord(patient.id);
  const teeth = dentalRecord?.teeth ?? [];

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href={`/patients/${patient.id}`}>
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Odontograma</h1>
            <p className="text-muted-foreground">
              <PawPrint className="mr-1 inline h-4 w-4" />
              {patient.name} &middot; {patient.species === 'dog' ? 'Perro' : patient.species === 'cat' ? 'Gato' : patient.species}
            </p>
          </div>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Salud Dental</CardTitle>
        </CardHeader>
        <CardContent>
          <OdontogramClient patientId={patient.id} species={patient.species} initialTeeth={teeth} />
        </CardContent>
      </Card>
    </div>
  );
}
