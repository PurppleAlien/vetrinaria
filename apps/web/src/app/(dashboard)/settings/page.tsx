import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Settings, Database, Shield, Palette, Building2 } from 'lucide-react';

const sections = [
  { href: '/settings/backups', label: 'Copias de Seguridad', desc: 'Crear, restaurar y eliminar backups', icon: Database },
  { href: '/settings/clinics', label: 'Clínicas', desc: 'Administración multi-tenant', icon: Building2 },
  { href: '/settings', label: 'Seguridad', desc: 'Roles, permisos y auditoría', icon: Shield, disabled: true },
  { href: '/settings', label: 'Apariencia', desc: 'Personalización de la interfaz', icon: Palette, disabled: true },
];

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div><h1 className="text-3xl font-bold tracking-tight">Configuración</h1><p className="text-muted-foreground">Administración del sistema</p></div>
      <div className="grid gap-4 sm:grid-cols-2">
        {sections.map((s) => {
          const Icon = s.icon;
          return (
            <Card key={s.label} className={s.disabled ? 'opacity-50' : 'transition-shadow hover:shadow-md'}>
              <CardContent className="p-4">
                <Link href={s.href} className={`flex items-start gap-3 ${s.disabled ? 'pointer-events-none' : ''}`}>
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">{s.label}</p>
                    <p className="text-sm text-muted-foreground">{s.desc}</p>
                  </div>
                </Link>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
