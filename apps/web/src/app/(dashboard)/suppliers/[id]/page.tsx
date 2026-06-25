import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getSupplier } from '@/lib/actions/suppliers';
import { ArrowLeft, Edit, Building2, Mail, Phone, MapPin, User } from 'lucide-react';

interface Props { params: Promise<{ id: string }> }

export default async function SupplierDetailPage({ params }: Props) {
  const { id } = await params;
  const supplier = await getSupplier(Number(id));
  if (!supplier) notFound();

  const details = [
    { label: 'Contacto', value: supplier.contact || '—', icon: User },
    { label: 'Email', value: supplier.email || '—', icon: Mail, href: supplier.email ? `mailto:${supplier.email}` : undefined },
    { label: 'Teléfono', value: supplier.phone || '—', icon: Phone, href: supplier.phone ? `tel:${supplier.phone}` : undefined },
    { label: 'Dirección', value: supplier.address || '—', icon: MapPin },
  ];

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/suppliers"><ArrowLeft className="h-4 w-4" /></Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{supplier.name}</h1>
            <p className="text-muted-foreground">Proveedor</p>
          </div>
        </div>
        <Button asChild>
          <Link href={`/suppliers/${supplier.id}/edit`}><Edit className="mr-2 h-4 w-4" />Editar</Link>
        </Button>
      </div>

      <Card>
        <CardHeader><CardTitle>Información de Contacto</CardTitle></CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            {details.map(({ label, value, icon: Icon, href }) => (
              <div key={label} className="flex items-start gap-3">
                <Icon className="mt-0.5 h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">{label}</p>
                  {href ? (
                    <a href={href} className="text-sm font-medium hover:underline">{value}</a>
                  ) : (
                    <p className="text-sm font-medium">{value}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
