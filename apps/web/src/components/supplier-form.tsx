'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface FormData {
  name: string;
  contact: string;
  email: string;
  phone: string;
  address: string;
}

interface Props {
  defaultValues?: Partial<FormData>;
  onSubmit: (data: FormData) => Promise<void>;
  submitLabel?: string;
}

export function SupplierForm({ defaultValues, onSubmit, submitLabel = 'Guardar' }: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError('');

    const form = new FormData(e.currentTarget);
    const data: FormData = {
      name: form.get('name') as string,
      contact: (form.get('contact') as string) || '',
      email: (form.get('email') as string) || '',
      phone: (form.get('phone') as string) || '',
      address: (form.get('address') as string) || '',
    };

    if (!data.name) {
      setError('El nombre es obligatorio');
      setLoading(false);
      return;
    }

    try {
      await onSubmit(data);
    } catch {
      setError('Error al guardar el proveedor');
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="name">Nombre <span className="text-destructive">*</span></Label>
          <Input id="name" name="name" defaultValue={defaultValues?.name} required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="contact">Contacto</Label>
          <Input id="contact" name="contact" defaultValue={defaultValues?.contact} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" type="email" defaultValue={defaultValues?.email} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone">Teléfono</Label>
          <Input id="phone" name="phone" type="tel" defaultValue={defaultValues?.phone} />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="address">Dirección</Label>
        <Textarea id="address" name="address" rows={2} defaultValue={defaultValues?.address} />
      </div>
      {error && <p className="text-sm text-destructive">{error}</p>}
      <div className="flex justify-end">
        <Button type="submit" disabled={loading}>{loading ? 'Guardando...' : submitLabel}</Button>
      </div>
    </form>
  );
}
