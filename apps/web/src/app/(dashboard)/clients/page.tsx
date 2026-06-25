import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Search, Users } from 'lucide-react';
import { getClients } from '@/lib/actions/clients';

interface Props {
  searchParams?: Promise<{ q?: string }>;
}

export default async function ClientsPage({ searchParams }: Props) {
  const q = (await searchParams)?.q;
  const clients = await getClients(q);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Clientes</h1>
          <p className="text-muted-foreground">Gestiona los dueños de mascotas</p>
        </div>
        <Button asChild>
          <Link href="/clients/new">
            <Plus className="mr-2 h-4 w-4" />
            Nuevo Cliente
          </Link>
        </Button>
      </div>

      <form method="GET" action="/clients">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            name="q"
            placeholder="Buscar clientes..."
            defaultValue={q}
            className="pl-9"
          />
        </div>
      </form>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-medium">
            {clients.length} {clients.length === 1 ? 'cliente' : 'clientes'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {clients.length === 0 ? (
            <div className="flex flex-col items-center gap-2 py-12 text-center">
              <Users className="h-12 w-12 text-muted-foreground/50" />
              <p className="text-muted-foreground">
                {q ? 'No se encontraron clientes con ese criterio.' : 'No hay clientes registrados.'}
              </p>
              <Button asChild variant="outline" size="sm">
                <Link href="/clients/new">Registrar primer cliente</Link>
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left text-muted-foreground">
                    <th className="pb-3 font-medium">Nombre</th>
                    <th className="pb-3 font-medium">Email</th>
                    <th className="pb-3 font-medium">Teléfono</th>
                    <th className="pb-3 font-medium">Registrado</th>
                    <th className="pb-3 font-medium" />
                  </tr>
                </thead>
                <tbody>
                  {clients.map((client) => (
                    <tr key={client.id} className="border-b last:border-0">
                      <td className="py-3">
                        <Link
                          href={`/clients/${client.id}`}
                          className="font-medium hover:underline"
                        >
                          {client.name}
                        </Link>
                      </td>
                      <td className="py-3 text-muted-foreground">
                        {client.email || '—'}
                      </td>
                      <td className="py-3">{client.phone}</td>
                      <td className="py-3 text-muted-foreground">
                        {new Date(client.createdAt).toLocaleDateString('es-ES')}
                      </td>
                      <td className="py-3 text-right">
                        <Button asChild variant="ghost" size="sm">
                          <Link href={`/clients/${client.id}`}>Ver</Link>
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
