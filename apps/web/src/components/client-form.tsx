'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface FormData {
  name: string;
  email: string;
  phone: string;
  address: string;
  emergencyContact: string;
  notes: string;
}

interface Props {
  defaultValues?: Partial<FormData>;
  onSubmit: (data: FormData) => Promise<void>;
  submitLabel?: string;
}

export function ClientForm({ defaultValues, onSubmit, submitLabel = 'Guardar' }: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError('');

    const form = new FormData(e.currentTarget);
    const data: FormData = {
      name: form.get('name') as string,
      email: (form.get('email') as string) || '',
      phone: form.get('phone') as string,
      address: (form.get('address') as string) || '',
      emergencyContact: (form.get('emergencyContact') as string) || '',
      notes: (form.get('notes') as string) || '',
    };

    if (!data.name || !data.phone) {
      setError('Nombre y teléfono son obligatorios');
      setLoading(false);
      return;
    }

    try {
      await onSubmit(data);
    } catch {
      setError('Error al guardar el cliente');
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="name">
            Nombre <span className="text-destructive">*</span>
          </Label>
          <Input id="name" name="name" defaultValue={defaultValues?.name} required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" type="email" defaultValue={defaultValues?.email} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone">
            Teléfono <span className="text-destructive">*</span>
          </Label>
          <Input id="phone" name="phone" type="tel" defaultValue={defaultValues?.phone} required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="emergencyContact">Contacto de emergencia</Label>
          <Input id="emergencyContact" name="emergencyContact" defaultValue={defaultValues?.emergencyContact} />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="address">Dirección</Label>
        <Input id="address" name="address" defaultValue={defaultValues?.address} />
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
