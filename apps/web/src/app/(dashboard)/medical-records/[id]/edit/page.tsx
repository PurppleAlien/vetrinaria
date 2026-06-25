import Link from 'next/link';
import { notFound } from 'next/navigation';
import { redirect } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MedicalRecordForm } from '@/components/medical-record-form';
import { getMedicalRecord, updateMedicalRecord } from '@/lib/actions/medical-records';
import { ArrowLeft } from 'lucide-react';

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditMedicalRecordPage({ params }: Props) {
  const { id } = await params;
  const recordId = Number(id);
  const record = await getMedicalRecord(recordId);

  if (!record) notFound();

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href={`/medical-records/${recordId}`}>
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Editar Registro Clínico</h1>
          <p className="text-muted-foreground">{record.patientName}</p>
        </div>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Registro SOAP</CardTitle>
        </CardHeader>
        <CardContent>
          <MedicalRecordForm
            patientId={record.patientId}
            defaultValues={{
              appointmentId: record.appointmentId,
              subjective: record.subjective || '',
              objective: record.objective || '',
              assessment: record.assessment || '',
              plan: record.plan || '',
              diagnosis: record.diagnosis || '',
              vitals: record.vitals || {},
            }}
            onSubmit={async (data) => {
              'use server';
              await updateMedicalRecord(recordId, data);
              redirect(`/medical-records/${recordId}`);
            }}
            submitLabel="Actualizar Registro"
          />
        </CardContent>
      </Card>
    </div>
  );
}
