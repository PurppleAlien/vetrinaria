import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getMedicalRecord } from '@/lib/actions/medical-records';
import { ArrowLeft, Edit, Calendar, User, Stethoscope, Weight, Thermometer, Heart, Wind, FileText } from 'lucide-react';

interface Props {
  params: Promise<{ id: string }>;
}

export default async function MedicalRecordDetailPage({ params }: Props) {
  const { id } = await params;
  const record = await getMedicalRecord(Number(id));

  if (!record) notFound();

  const sections = [
    { label: 'Subjetivo (S)', value: record.subjective, icon: FileText },
    { label: 'Objetivo (O)', value: record.objective, icon: FileText },
    { label: 'Evaluación (A)', value: record.assessment, icon: FileText },
    { label: 'Plan (P)', value: record.plan, icon: FileText },
  ];

  const vitals = [
    { label: 'Peso', value: record.vitals?.weight ? `${record.vitals.weight} kg` : null, icon: Weight },
    { label: 'Temperatura', value: record.vitals?.temperature ? `${record.vitals.temperature} °C` : null, icon: Thermometer },
    { label: 'Frec. Cardíaca', value: record.vitals?.heartRate ? `${record.vitals.heartRate} lpm` : null, icon: Heart },
    { label: 'Frec. Respiratoria', value: record.vitals?.respiratoryRate ? `${record.vitals.respiratoryRate} rpm` : null, icon: Wind },
  ];

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href={`/medical-records?patientId=${record.patientId}`}>
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold tracking-tight">
                {record.diagnosis || 'Registro Clínico'}
              </h1>
            </div>
            <p className="text-muted-foreground">
              {record.patientName} · {record.patientSpecies}
              {record.clientName ? ` · Dueño: ${record.clientName}` : ''}
            </p>
          </div>
        </div>
        <Button asChild>
          <Link href={`/medical-records/${record.id}/edit`}>
            <Edit className="mr-2 h-4 w-4" />
            Editar
          </Link>
        </Button>
      </div>

      <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
        <span className="flex items-center gap-1">
          <Calendar className="h-4 w-4" />
          {new Date(record.createdAt).toLocaleDateString('es-ES')}
        </span>
        {record.appointmentDate && (
          <span className="flex items-center gap-1">
            <Stethoscope className="h-4 w-4" />
            Cita: {record.appointmentDate}
          </span>
        )}
        {record.createdByName && (
          <span className="flex items-center gap-1">
            <User className="h-4 w-4" />
            {record.createdByName} {record.createdByLastName}
          </span>
        )}
      </div>

      {record.diagnosis && (
        <Card className="border-l-4 border-l-primary">
          <CardHeader>
            <CardTitle>Diagnóstico</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg font-medium">{record.diagnosis}</p>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Signos Vitales</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {vitals.map(({ label, value, icon: Icon }) => (
              <div key={label} className="flex flex-col items-center gap-1 rounded-lg border p-3 text-center">
                <Icon className="h-5 w-5 text-muted-foreground" />
                <p className="text-xs text-muted-foreground">{label}</p>
                <p className="text-sm font-medium">{value ?? '—'}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        {sections.map(({ label, value, icon: Icon }) => (
          <Card key={label} className={!value ? 'opacity-50' : ''}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Icon className="h-4 w-4" />
                {label}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {value ? (
                <p className="text-sm whitespace-pre-wrap">{value}</p>
              ) : (
                <p className="text-sm text-muted-foreground italic">Sin registro</p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
