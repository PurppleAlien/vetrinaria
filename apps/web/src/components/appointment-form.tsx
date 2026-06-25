'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface ClientOption {
  id: number;
  name: string;
}

interface PatientOption {
  id: number;
  name: string;
  species: string;
}

interface VetOption {
  id: number;
  name: string;
}

interface FormData {
  clientId: number;
  patientId: number;
  vetId: number | null;
  date: string;
  startTime: string;
  endTime: string;
  type: string;
  notes: string;
  room: string;
}

interface Props {
  defaultValues?: Partial<FormData>;
  onSubmit: (data: FormData) => Promise<void>;
  submitLabel?: string;
}

const typeLabels: Record<string, string> = {
  consultation: 'Consulta general',
  vaccination: 'Vacunación',
  surgery: 'Cirugía',
  emergency: 'Urgencia',
  grooming: 'Estética',
  boarding: 'Hospitalización',
  follow_up: 'Seguimiento',
  other: 'Otro',
};

export function AppointmentForm({ defaultValues, onSubmit, submitLabel = 'Guardar' }: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [clients, setClients] = useState<ClientOption[]>([]);
  const [patients, setPatients] = useState<PatientOption[]>([]);
  const [vets, setVets] = useState<VetOption[]>([]);
  const [selectedClient, setSelectedClient] = useState<number | ''>(defaultValues?.clientId || '');

  useEffect(() => {
    fetch('/api/clients/list')
      .then((r) => r.json())
      .then(setClients)
      .catch(() => {});
    fetch('/api/users/vets')
      .then((r) => r.json())
      .then(setVets)
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (selectedClient) {
      fetch(`/api/patients/by-client/${selectedClient}`)
        .then((r) => r.json())
        .then(setPatients)
        .catch(() => setPatients([]));
    } else {
      setPatients([]);
    }
  }, [selectedClient]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError('');

    const form = new FormData(e.currentTarget);
    const data: FormData = {
      clientId: Number(form.get('clientId')),
      patientId: Number(form.get('patientId')),
      vetId: form.get('vetId') ? Number(form.get('vetId')) : null,
      date: form.get('date') as string,
      startTime: form.get('startTime') as string,
      endTime: form.get('endTime') as string,
      type: form.get('type') as string,
      notes: (form.get('notes') as string) || '',
      room: (form.get('room') as string) || '',
    };

    if (!data.clientId || !data.patientId || !data.date || !data.startTime || !data.endTime || !data.type) {
      setError('Todos los campos obligatorios deben completarse');
      setLoading(false);
      return;
    }

    try {
      await onSubmit(data);
    } catch {
      setError('Error al guardar la cita');
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="clientId">
            Dueño <span className="text-destructive">*</span>
          </Label>
          <select
            id="clientId"
            name="clientId"
            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            value={selectedClient}
            onChange={(e) => setSelectedClient(Number(e.target.value) || '')}
          >
            <option value="">Seleccionar dueño...</option>
            {clients.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="patientId">
            Paciente <span className="text-destructive">*</span>
          </Label>
          <select
            id="patientId"
            name="patientId"
            defaultValue={defaultValues?.patientId || ''}
            required
            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          >
            <option value="">Seleccionar paciente...</option>
            {patients.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name} ({p.species})
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="date">
            Fecha <span className="text-destructive">*</span>
          </Label>
          <Input id="date" name="date" type="date" defaultValue={defaultValues?.date} required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="vetId">Veterinario</Label>
          <select
            id="vetId"
            name="vetId"
            defaultValue={defaultValues?.vetId || ''}
            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          >
            <option value="">Sin asignar...</option>
            {vets.map((v) => (
              <option key={v.id} value={v.id}>
                {v.name}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="startTime">
            Hora inicio <span className="text-destructive">*</span>
          </Label>
          <Input id="startTime" name="startTime" type="time" defaultValue={defaultValues?.startTime} required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="endTime">
            Hora fin <span className="text-destructive">*</span>
          </Label>
          <Input id="endTime" name="endTime" type="time" defaultValue={defaultValues?.endTime} required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="type">
            Tipo <span className="text-destructive">*</span>
          </Label>
          <select
            id="type"
            name="type"
            defaultValue={defaultValues?.type || ''}
            required
            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          >
            <option value="">Seleccionar...</option>
            {Object.entries(typeLabels).map(([k, v]) => (
              <option key={k} value={k}>
                {v}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="room">Consultorio / Sala</Label>
          <Input id="room" name="room" defaultValue={defaultValues?.room} />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="notes">Notas</Label>
        <Textarea id="notes" name="notes" rows={3} defaultValue={defaultValues?.notes} />
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
