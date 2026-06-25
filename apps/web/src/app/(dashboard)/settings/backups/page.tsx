import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Database, HardDriveDownload, HardDriveUpload, Trash2, RefreshCw, ShieldAlert } from 'lucide-react';
import { getBackups, triggerBackup, removeBackup, restoreFromBackup } from '@/lib/actions/backups';
import { formatSize } from '@/lib/backup';

export default async function BackupsPage() {
  const backups = await getBackups();

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/settings"><ArrowLeft className="h-4 w-4" /></Link>
          </Button>
          <div><h1 className="text-3xl font-bold tracking-tight">Copias de Seguridad</h1><p className="text-muted-foreground">Backups de la base de datos</p></div>
        </div>
        <form action={triggerBackup}>
          <Button type="submit">
            <HardDriveDownload className="mr-2 h-4 w-4" />Crear Backup
          </Button>
        </form>
      </div>

      <Card className="border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-950">
        <CardContent className="flex items-start gap-3 p-4">
          <ShieldAlert className="mt-0.5 h-5 w-5 shrink-0 text-amber-600 dark:text-amber-400" />
          <div className="text-sm text-amber-800 dark:text-amber-200">
            <p className="font-medium">Importante</p>
            <p>La restauración sobreescribe todos los datos actuales. Asegúrate de tener un backup reciente antes de restaurar.</p>
          </div>
        </CardContent>
      </Card>

      <Card><CardHeader><CardTitle>Backups Automáticos</CardTitle></CardHeader>
        <CardContent className="text-sm space-y-2">
          <p>Para programar backups automáticos via cron, agrega esta línea:</p>
          <pre className="rounded bg-muted p-2 text-xs overflow-x-auto">0 2 * * * /path/to/vetrinaria/scripts/backup.sh</pre>
          <p className="text-muted-foreground">Ejecuta un backup diario a las 2:00 AM. Los backups se almacenan en <code className="text-xs">backups/</code>.</p>
        </CardContent>
      </Card>

      {backups.length === 0 ? (
        <Card><CardContent className="flex flex-col items-center gap-2 py-12 text-center">
          <Database className="h-12 w-12 text-muted-foreground/50" />
          <p className="text-muted-foreground">No hay copias de seguridad.</p>
          <p className="text-xs text-muted-foreground">Crea tu primer backup con el botón superior.</p>
        </CardContent></Card>
      ) : (
        <Card>
          <CardHeader><CardTitle className="text-lg font-medium">{backups.length} backup(s)</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-2">
              {backups.map((b) => (
                <div key={b.filename} className="flex items-center justify-between rounded-lg border p-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <Database className="h-5 w-5 shrink-0 text-muted-foreground" />
                    <div className="min-w-0">
                      <p className="text-sm font-medium truncate">{b.filename}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatSize(b.size)} · {new Date(b.createdAt).toLocaleDateString('es-ES', {
                          day: 'numeric', month: 'long', year: 'numeric',
                          hour: '2-digit', minute: '2-digit',
                        })}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-1 shrink-0">
                    <form action={async () => { 'use server'; await restoreFromBackup(b.filename); }}>
                      <Button type="submit" variant="outline" size="sm" className="text-xs">
                        <HardDriveUpload className="mr-1 h-3 w-3" />Restaurar
                      </Button>
                    </form>
                    <form action={async () => { 'use server'; await removeBackup(b.filename); }}>
                      <Button type="submit" variant="ghost" size="sm" className="text-destructive">
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </form>
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
