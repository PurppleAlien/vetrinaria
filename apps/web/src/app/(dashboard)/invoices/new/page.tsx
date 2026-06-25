'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Trash2 } from 'lucide-react';
import { createInvoice } from '@/lib/actions/invoices';

interface ItemRow {
  description: string;
  quantity: number;
  unitPrice: string;
}

export default function NewInvoicePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [clients, setClients] = useState<{ id: number; name: string }[]>([]);
  const [clientId, setClientId] = useState<number | ''>('');
  const [appointmentId, setAppointmentId] = useState<number | ''>('');
  const [appointments, setAppointments] = useState<{ id: number; date: string; patientName: string }[]>([]);
  const [items, setItems] = useState<ItemRow[]>([{ description: '', quantity: 1, unitPrice: '' }]);
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('/api/clients/list').then((r) => r.json()).then(setClients).catch(() => {});
  }, []);

  useEffect(() => {
    if (clientId) {
      fetch(`/api/appointments/by-client/${clientId}`)
        .then((r) => r.json())
        .then((data) => {
          const mapped = data.map((a: any) => ({
            id: a.id,
            date: a.date,
            patientName: a.patientName || '',
          }));
          setAppointments(mapped);
        })
        .catch(() => setAppointments([]));
    } else {
      setAppointments([]);
    }
  }, [clientId]);

  function addItem() {
    setItems([...items, { description: '', quantity: 1, unitPrice: '' }]);
  }

  function removeItem(idx: number) {
    setItems(items.filter((_, i) => i !== idx));
  }

  function updateItem(idx: number, field: keyof ItemRow, value: string | number) {
    const updated = items.map((item, i) =>
      i === idx ? { ...item, [field]: value } : item,
    );
    setItems(updated);
  }

  const subtotal = items.reduce((sum, item) => sum + (Number(item.unitPrice) || 0) * (item.quantity || 0), 0);
  const tax = Math.round(subtotal * 0.16 * 100) / 100;
  const total = subtotal + tax;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!clientId) { setError('Selecciona un cliente'); return; }
    if (items.some((i) => !i.description || !i.unitPrice)) { setError('Completa todos los items'); return; }

    setLoading(true);
    setError('');

    try {
      const invoiceId = await createInvoice({
        clientId: Number(clientId),
        appointmentId: appointmentId ? Number(appointmentId) : null,
        items: items.map((i) => ({
          description: i.description,
          quantity: i.quantity,
          unitPrice: i.unitPrice,
        })),
        notes,
      });
      router.push(`/invoices/${invoiceId}`);
    } catch {
      setError('Error al crear la factura');
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div><h1 className="text-3xl font-bold tracking-tight">Nueva Factura</h1><p className="text-muted-foreground">Crear factura para un cliente</p></div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card><CardHeader><CardTitle>Cliente</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Cliente <span className="text-destructive">*</span></Label>
              <select value={clientId} onChange={(e) => setClientId(Number(e.target.value) || '')}
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring">
                <option value="">Seleccionar...</option>
                {clients.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div className="space-y-2">
              <Label>Cita asociada (opcional)</Label>
              <select value={appointmentId} onChange={(e) => setAppointmentId(Number(e.target.value) || '')}
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring">
                <option value="">Sin cita</option>
                {appointments.map((a) => <option key={a.id} value={a.id}>{a.date} - {a.patientName}</option>)}
              </select>
            </div>
          </CardContent>
        </Card>

        <Card><CardHeader><CardTitle>Conceptos</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {items.map((item, idx) => (
              <div key={idx} className="flex gap-2 items-start">
                <div className="flex-1 space-y-1">
                  <Input placeholder="Descripción" value={item.description}
                    onChange={(e) => updateItem(idx, 'description', e.target.value)} required />
                </div>
                <div className="w-20 space-y-1">
                  <Input type="number" placeholder="Cant." value={item.quantity}
                    onChange={(e) => updateItem(idx, 'quantity', Number(e.target.value))} min={1} required />
                </div>
                <div className="w-28 space-y-1">
                  <Input type="number" step="0.01" placeholder="Precio" value={item.unitPrice}
                    onChange={(e) => updateItem(idx, 'unitPrice', e.target.value)} required />
                </div>
                <div className="w-20 pt-1 text-sm font-medium text-right">
                  ${((Number(item.unitPrice) || 0) * (item.quantity || 0)).toFixed(2)}
                </div>
                <Button type="button" variant="ghost" size="icon" className="mt-0.5" onClick={() => removeItem(idx)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <Button type="button" variant="outline" size="sm" onClick={addItem}>
              <Plus className="mr-2 h-4 w-4" />Agregar concepto
            </Button>

            <div className="border-t pt-3 space-y-1 text-sm">
              <div className="flex justify-between"><span>Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
              <div className="flex justify-between"><span>IVA (16%)</span><span>${tax.toFixed(2)}</span></div>
              <div className="flex justify-between font-bold text-base"><span>Total</span><span>${total.toFixed(2)}</span></div>
            </div>
          </CardContent>
        </Card>

        <Card><CardHeader><CardTitle>Notas</CardTitle></CardHeader>
          <CardContent>
            <Textarea rows={2} value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Notas adicionales..." />
          </CardContent>
        </Card>

        {error && <p className="text-sm text-destructive">{error}</p>}

        <div className="flex justify-end">
          <Button type="submit" disabled={loading}>{loading ? 'Creando...' : 'Crear Factura'}</Button>
        </div>
      </form>
    </div>
  );
}
