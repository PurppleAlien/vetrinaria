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

interface FormData {
  clientId: number;
  name: string;
  species: string;
  breed: string;
  gender: string;
  birthDate: string;
  color: string;
  microchip: string;
  allergies: string;
  notes: string;
}

interface Props {
  defaultValues?: Partial<FormData>;
  onSubmit: (data: FormData) => Promise<void>;
  submitLabel?: string;
}

export function PatientForm({ defaultValues, onSubmit, submitLabel = 'Guardar' }: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [clients, setClients] = useState<ClientOption[]>([]);

  useEffect(() => {
    fetch('/api/clients/list')
      .then((r) => r.json())
      .then(setClients)
      .catch(() => {});
  }, []);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError('');

    const form = new FormData(e.currentTarget);
    const data: FormData = {
      clientId: Number(form.get('clientId')),
      name: form.get('name') as string,
      species: form.get('species') as string,
      breed: (form.get('breed') as string) || '',
      gender: form.get('gender') as string,
      birthDate: (form.get('birthDate') as string) || '',
      color: (form.get('color') as string) || '',
      microchip: (form.get('microchip') as string) || '',
      allergies: (form.get('allergies') as string) || '',
      notes: (form.get('notes') as string) || '',
    };

    if (!data.clientId || !data.name || !data.species || !data.gender) {
      setError('Dueño, nombre, especie y sexo son obligatorios');
      setLoading(false);
      return;
    }

    try {
      await onSubmit(data);
    } catch {
      setError('Error al guardar el paciente');
      setLoading(false);
    }
  }

  const speciesLabels: Record<string, string> = {
    dog: 'Perro',
    cat: 'Gato',
    rabbit: 'Conejo',
    bird: 'Ave',
    reptile: 'Reptil',
    other: 'Otro',
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="clientId">
          Dueño <span className="text-destructive">*</span>
        </Label>
        <select
          id="clientId"
          name="clientId"
          defaultValue={defaultValues?.clientId || ''}
          required
          className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
        >
          <option value="">Seleccionar dueño...</option>
          {clients.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="name">
            Nombre <span className="text-destructive">*</span>
          </Label>
          <Input id="name" name="name" defaultValue={defaultValues?.name} required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="species">
            Especie <span className="text-destructive">*</span>
          </Label>
          <select
            id="species"
            name="species"
            defaultValue={defaultValues?.species || ''}
            required
            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          >
            <option value="">Seleccionar...</option>
            {Object.entries(speciesLabels).map(([k, v]) => (
              <option key={k} value={k}>
                {v}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="breed">Raza</Label>
          <Input id="breed" name="breed" defaultValue={defaultValues?.breed} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="gender">
            Sexo <span className="text-destructive">*</span>
          </Label>
          <select
            id="gender"
            name="gender"
            defaultValue={defaultValues?.gender || ''}
            required
            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          >
            <option value="">Seleccionar...</option>
            <option value="male">Macho</option>
            <option value="female">Hembra</option>
          </select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="birthDate">Fecha de nacimiento</Label>
          <Input id="birthDate" name="birthDate" type="date" defaultValue={defaultValues?.birthDate} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="color">Color</Label>
          <Input id="color" name="color" defaultValue={defaultValues?.color} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="microchip">Microchip</Label>
          <Input id="microchip" name="microchip" defaultValue={defaultValues?.microchip} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="allergies">Alergias</Label>
          <Input id="allergies" name="allergies" defaultValue={defaultValues?.allergies} />
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
