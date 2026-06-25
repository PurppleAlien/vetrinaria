'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface AppointmentOption {
  id: number;
  date: string;
  startTime: string;
}

interface FormData {
  patientId: number;
  appointmentId: number | null;
  subjective: string;
  objective: string;
  assessment: string;
  plan: string;
  diagnosis: string;
  vitals: {
    weight?: number;
    temperature?: number;
    heartRate?: number;
    respiratoryRate?: number;
  };
}

interface Props {
  patientId: number;
  defaultValues?: Partial<FormData>;
  onSubmit: (data: FormData) => Promise<void>;
  submitLabel?: string;
}

export function MedicalRecordForm({ patientId, defaultValues, onSubmit, submitLabel = 'Guardar' }: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [appointments, setAppointments] = useState<AppointmentOption[]>([]);

  useEffect(() => {
    fetch(`/api/appointments/by-patient/${patientId}`)
      .then((r) => r.json())
      .then(setAppointments)
      .catch(() => {});
  }, [patientId]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError('');

    const form = new FormData(e.currentTarget);
    const data: FormData = {
      patientId,
      appointmentId: form.get('appointmentId') ? Number(form.get('appointmentId')) : null,
      subjective: (form.get('subjective') as string) || '',
      objective: (form.get('objective') as string) || '',
      assessment: (form.get('assessment') as string) || '',
      plan: (form.get('plan') as string) || '',
      diagnosis: (form.get('diagnosis') as string) || '',
      vitals: {
        weight: form.get('weight') ? Number(form.get('weight')) : undefined,
        temperature: form.get('temperature') ? Number(form.get('temperature')) : undefined,
        heartRate: form.get('heartRate') ? Number(form.get('heartRate')) : undefined,
        respiratoryRate: form.get('respiratoryRate') ? Number(form.get('respiratoryRate')) : undefined,
      },
    };

    try {
      await onSubmit(data);
    } catch {
      setError('Error al guardar el registro');
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="appointmentId">Cita asociada</Label>
        <select
          id="appointmentId"
          name="appointmentId"
          defaultValue={defaultValues?.appointmentId || ''}
          className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
        >
          <option value="">Sin cita asociada</option>
          {appointments.map((a) => (
            <option key={a.id} value={a.id}>
              {a.date} {a.startTime?.slice(0, 5)}
            </option>
          ))}
        </select>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <div className="space-y-2">
          <Label htmlFor="weight">Peso (kg)</Label>
          <Input id="weight" name="weight" type="number" step="0.1" defaultValue={defaultValues?.vitals?.weight} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="temperature">Temp. (°C)</Label>
          <Input id="temperature" name="temperature" type="number" step="0.1" defaultValue={defaultValues?.vitals?.temperature} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="heartRate">FC (lpm)</Label>
          <Input id="heartRate" name="heartRate" type="number" defaultValue={defaultValues?.vitals?.heartRate} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="respiratoryRate">FR (rpm)</Label>
          <Input id="respiratoryRate" name="respiratoryRate" type="number" defaultValue={defaultValues?.vitals?.respiratoryRate} />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="diagnosis">Diagnóstico</Label>
        <Input id="diagnosis" name="diagnosis" defaultValue={defaultValues?.diagnosis} />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="subjective">Subjetivo (S)</Label>
          <Textarea id="subjective" name="subjective" rows={4} defaultValue={defaultValues?.subjective} placeholder="Historia del paciente, síntomas reportados por el dueño..." />
        </div>
        <div className="space-y-2">
          <Label htmlFor="objective">Objetivo (O)</Label>
          <Textarea id="objective" name="objective" rows={4} defaultValue={defaultValues?.objective} placeholder="Hallazgos del examen físico..." />
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="assessment">Evaluación (A)</Label>
          <Textarea id="assessment" name="assessment" rows={4} defaultValue={defaultValues?.assessment} placeholder="Análisis y diagnóstico diferencial..." />
        </div>
        <div className="space-y-2">
          <Label htmlFor="plan">Plan (P)</Label>
          <Textarea id="plan" name="plan" rows={4} defaultValue={defaultValues?.plan} placeholder="Tratamiento, medicación, seguimiento..." />
        </div>
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}
      <div className="flex justify-end gap-2">
        <Button type="submit" disabled={loading}>
          {loading ? 'Guardando...' : submitLabel}
        </Button>
      </div>
    </form>
  );
}
