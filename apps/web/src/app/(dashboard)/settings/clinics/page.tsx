import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Building2 } from 'lucide-react';
import { getClinics } from '@/lib/actions/clinics';

export const dynamic = 'force-dynamic';

export default async function ClinicsSettingsPage() {
  const clinics = await getClinics();

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-3xl font-bold tracking-tight">Clínicas</h1><p className="text-muted-foreground">Administración de clínicas (multi-tenant)</p></div>
        <Button asChild><Link href="/settings/clinics/new"><Plus className="mr-2 h-4 w-4" />Nueva Clínica</Link></Button>
      </div>

      {clinics.length === 0 ? (
        <Card><CardContent className="flex flex-col items-center gap-2 py-12 text-center">
          <Building2 className="h-12 w-12 text-muted-foreground/50" />
          <p className="text-muted-foreground">No hay clínicas registradas.</p>
        </CardContent></Card>
      ) : (
        <Card>
          <CardHeader><CardTitle className="text-lg font-medium">{clinics.length} clínica(s)</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-2">
              {clinics.map((c) => (
                <div key={c.id} className="flex items-center justify-between rounded-lg border p-3">
                  <div className="flex items-center gap-3">
                    <Building2 className="h-5 w-5 text-muted-foreground shrink-0" />
                    <div>
                      <p className="text-sm font-medium">{c.name}</p>
                      <p className="text-xs text-muted-foreground">{c.slug}{c.email ? ` · ${c.email}` : ''}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button asChild variant="outline" size="sm"><Link href={`/settings/clinics/${c.id}/edit`}>Editar</Link></Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
