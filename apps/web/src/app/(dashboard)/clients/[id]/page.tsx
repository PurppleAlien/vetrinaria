import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getClient } from '@/lib/actions/clients';
import { ArrowLeft, Edit, Mail, Phone, MapPin, PhoneCall, FileText } from 'lucide-react';

interface Props {
  params: Promise<{ id: string }>;
}

export default async function ClientDetailPage({ params }: Props) {
  const { id } = await params;
  const client = await getClient(Number(id));

  if (!client) notFound();

  const details = [
    { label: 'Email', value: client.email, icon: Mail, href: `mailto:${client.email}` },
    { label: 'Teléfono', value: client.phone, icon: Phone, href: `tel:${client.phone}` },
    { label: 'Dirección', value: client.address, icon: MapPin },
    { label: 'Contacto de emergencia', value: client.emergencyContact, icon: PhoneCall },
    { label: 'Notas', value: client.notes, icon: FileText },
  ];

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/clients">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{client.name}</h1>
            <p className="text-muted-foreground">
              Cliente desde {new Date(client.createdAt).toLocaleDateString('es-ES')}
            </p>
          </div>
        </div>
        <Button asChild>
          <Link href={`/clients/${client.id}/edit`}>
            <Edit className="mr-2 h-4 w-4" />
            Editar
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Información de Contacto</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            {details.map(({ label, value, icon: Icon, href }) =>
              value ? (
                <div key={label} className="flex items-start gap-3">
                  <Icon className="mt-0.5 h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">{label}</p>
                    {href ? (
                      <a href={href} className="text-sm font-medium hover:underline">
                        {value}
                      </a>
                    ) : (
                      <p className="text-sm font-medium">{value}</p>
                    )}
                  </div>
                </div>
              ) : null,
            )}
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Mascotas</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Este cliente no tiene mascotas registradas aún.
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Últimas Citas</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Sin citas registradas.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
