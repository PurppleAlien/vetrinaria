'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface FormData {
  name: string;
  description: string;
  type: string;
  sku: string;
  price: string;
  costPrice: string;
  stockQuantity: number;
  reorderPoint: number;
}

interface Props {
  defaultValues?: Partial<FormData>;
  onSubmit: (data: FormData) => Promise<void>;
  submitLabel?: string;
}

const typeLabels: Record<string, string> = {
  medication: 'Medicamento', supply: 'Insumo', food: 'Alimento', service: 'Servicio',
};

export function ProductForm({ defaultValues, onSubmit, submitLabel = 'Guardar' }: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError('');

    const form = new FormData(e.currentTarget);
    const data: FormData = {
      name: form.get('name') as string,
      description: (form.get('description') as string) || '',
      type: form.get('type') as string,
      sku: (form.get('sku') as string) || '',
      price: form.get('price') as string,
      costPrice: (form.get('costPrice') as string) || '',
      stockQuantity: Number(form.get('stockQuantity')) || 0,
      reorderPoint: Number(form.get('reorderPoint')) || 0,
    };

    if (!data.name || !data.type || !data.price) {
      setError('Nombre, tipo y precio son obligatorios');
      setLoading(false);
      return;
    }

    try {
      await onSubmit(data);
    } catch {
      setError('Error al guardar el producto');
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
          <Label htmlFor="type">Tipo <span className="text-destructive">*</span></Label>
          <select id="type" name="type" defaultValue={defaultValues?.type || ''} required
            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring">
            <option value="">Seleccionar...</option>
            {Object.entries(typeLabels).map(([k, v]) => (
              <option key={k} value={k}>{v}</option>
            ))}
          </select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="sku">SKU</Label>
          <Input id="sku" name="sku" defaultValue={defaultValues?.sku} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="price">Precio venta <span className="text-destructive">*</span></Label>
          <Input id="price" name="price" type="number" step="0.01" defaultValue={defaultValues?.price} required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="costPrice">Precio costo</Label>
          <Input id="costPrice" name="costPrice" type="number" step="0.01" defaultValue={defaultValues?.costPrice} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="stockQuantity">Stock</Label>
          <Input id="stockQuantity" name="stockQuantity" type="number" defaultValue={defaultValues?.stockQuantity ?? 0} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="reorderPoint">Stock mínimo</Label>
          <Input id="reorderPoint" name="reorderPoint" type="number" defaultValue={defaultValues?.reorderPoint ?? 10} />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="description">Descripción</Label>
        <Textarea id="description" name="description" rows={3} defaultValue={defaultValues?.description} />
      </div>
      {error && <p className="text-sm text-destructive">{error}</p>}
      <div className="flex justify-end">
        <Button type="submit" disabled={loading}>{loading ? 'Guardando...' : submitLabel}</Button>
      </div>
    </form>
  );
}
