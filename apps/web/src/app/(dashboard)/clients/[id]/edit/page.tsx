import Link from 'next/link';
import { notFound } from 'next/navigation';
import { redirect } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ClientForm } from '@/components/client-form';
import { getClient, updateClient } from '@/lib/actions/clients';
import { ArrowLeft } from 'lucide-react';

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditClientPage({ params }: Props) {
  const { id } = await params;
  const clientId = Number(id);
  const client = await getClient(clientId);

  if (!client) notFound();

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href={`/clients/${clientId}`}>
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Editar Cliente</h1>
          <p className="text-muted-foreground">{client.name}</p>
        </div>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Datos del Cliente</CardTitle>
        </CardHeader>
        <CardContent>
          <ClientForm
            defaultValues={{
              name: client.name,
              email: client.email || '',
              phone: client.phone,
              address: client.address || '',
              emergencyContact: client.emergencyContact || '',
              notes: client.notes || '',
            }}
            onSubmit={async (data) => {
              'use server';
              await updateClient(clientId, data);
              redirect(`/clients/${clientId}`);
            }}
            submitLabel="Actualizar Cliente"
          />
        </CardContent>
      </Card>
    </div>
  );
}
