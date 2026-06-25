import Link from 'next/link';
import { notFound } from 'next/navigation';
import dynamic from 'next/dynamic';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getPatient } from '@/lib/actions/patients';
import { getLatestDentalRecord } from '@/lib/actions/dental-records';
import { ArrowLeft, Edit, PawPrint, Calendar, User, Ruler, AlertCircle, Hash, FileText } from 'lucide-react';

const Odontogram = dynamic(() => import('@/components/odontogram').then((m) => m.Odontogram), {
  ssr: true,
  loading: () => (
    <div className="flex items-center justify-center py-8">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-muted border-t-primary" />
    </div>
  ),
});

interface Props {
  params: Promise<{ id: string }>;
}

const speciesLabels: Record<string, string> = {
  dog: 'Perro', cat: 'Gato', rabbit: 'Conejo',
  bird: 'Ave', reptile: 'Reptil', other: 'Otro',
};

export default async function PatientDetailPage({ params }: Props) {
  const { id } = await params;
  const patient = await getPatient(Number(id));

  if (!patient) notFound();

  const dentalRecord = await getLatestDentalRecord(patient.id);
  const teeth = dentalRecord?.teeth ?? [];

  const age = patient.birthDate
    ? `${Math.floor((Date.now() - new Date(patient.birthDate).getTime()) / 31557600000)} años`
    : 'Desconocida';

  const details = [
    { label: 'Especie', value: speciesLabels[patient.species] || patient.species, icon: PawPrint },
    { label: 'Raza', value: patient.breed || '—', icon: Ruler },
    { label: 'Sexo', value: patient.gender === 'male' ? 'Macho' : 'Hembra', icon: User },
    { label: 'Edad', value: age, icon: Calendar },
    { label: 'Color', value: patient.color || '—', icon: Ruler },
    { label: 'Microchip', value: patient.microchip || '—', icon: Hash },
    { label: 'Alergias', value: patient.allergies || '—', icon: AlertCircle },
  ];

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/patients">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{patient.name}</h1>
            <p className="text-muted-foreground">
              Registrado {new Date(patient.createdAt).toLocaleDateString('es-ES')}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href={`/odontogram/${patient.id}`}>
              <span className="mr-2 text-sm">🦷</span>
              Odontograma
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href={`/medical-records?patientId=${patient.id}`}>
              <FileText className="mr-2 h-4 w-4" />
              Historial
            </Link>
          </Button>
          <Button asChild>
            <Link href={`/patients/${patient.id}/edit`}>
              <Edit className="mr-2 h-4 w-4" />
              Editar
            </Link>
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Información General</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            {details.map(({ label, value, icon: Icon }) => (
              <div key={label} className="flex items-start gap-3">
                <Icon className="mt-0.5 h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">{label}</p>
                  <p className="text-sm font-medium">{value}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Dueño</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-3">
            <User className="h-4 w-4 text-muted-foreground" />
            <div>
              <Link
                href={`/clients/${patient.clientId}`}
                className="font-medium hover:underline"
              >
                {patient.clientName}
              </Link>
              <p className="text-xs text-muted-foreground">
                {patient.clientPhone} {patient.clientEmail ? `· ${patient.clientEmail}` : ''}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Odontograma</CardTitle>
        </CardHeader>
        <CardContent>
          <Odontogram species={patient.species} teeth={teeth} readOnly />
          <div className="mt-4">
            <Button variant="outline" size="sm" asChild>
              <Link href={`/odontogram/${patient.id}`}>
                Editar Odontograma
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      {patient.notes && (
        <Card>
          <CardHeader>
            <CardTitle>Notas</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm whitespace-pre-wrap">{patient.notes}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
