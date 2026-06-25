import { redirect } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ClientForm } from '@/components/client-form';
import { createClient } from '@/lib/actions/clients';

export default function NewClientPage() {
  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Nuevo Cliente</h1>
        <p className="text-muted-foreground">Registra un nuevo dueño de mascota</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Datos del Cliente</CardTitle>
        </CardHeader>
        <CardContent>
          <ClientForm
            onSubmit={async (data) => {
              'use server';
              await createClient(data);
              redirect('/clients');
            }}
            submitLabel="Crear Cliente"
          />
        </CardContent>
      </Card>
    </div>
  );
}
