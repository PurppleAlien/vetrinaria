'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface ClinicFormData {
  name: string;
  slug: string;
  email: string;
  phone: string;
  address: string;
}

interface Props {
  defaultValues?: Partial<ClinicFormData>;
  onSubmit: (data: ClinicFormData) => Promise<void>;
  submitLabel: string;
}

export function ClinicForm({ defaultValues, onSubmit, submitLabel }: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError('');

    const form = new FormData(e.currentTarget);
    const data: ClinicFormData = {
      name: form.get('name') as string,
      slug: form.get('slug') as string,
      email: (form.get('email') as string) || '',
      phone: (form.get('phone') as string) || '',
      address: (form.get('address') as string) || '',
    };

    try {
      await onSubmit(data);
    } catch (err: any) {
      setError(err?.message || 'Error al guardar');
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Nombre <span className="text-destructive">*</span></Label>
        <Input id="name" name="name" defaultValue={defaultValues?.name} required placeholder="Ej: Clínica Vet Central" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="slug">Slug <span className="text-destructive">*</span></Label>
        <Input id="slug" name="slug" defaultValue={defaultValues?.slug} required placeholder="Ej: vet-central" pattern="[a-z0-9-]+" />
        <p className="text-xs text-muted-foreground">Identificador único (solo minúsculas, números y guiones)</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" type="email" defaultValue={defaultValues?.email} placeholder="contacto@clinica.com" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone">Teléfono</Label>
          <Input id="phone" name="phone" defaultValue={defaultValues?.phone} placeholder="+52 55 1234 5678" />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="address">Dirección</Label>
        <Input id="address" name="address" defaultValue={defaultValues?.address} placeholder="Calle, número, colonia..." />
      </div>
      {error && <p className="text-sm text-destructive">{error}</p>}
      <Button type="submit" disabled={loading}>{loading ? 'Guardando...' : submitLabel}</Button>
    </form>
  );
}
