import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Bell, Calendar, Receipt, Users, PawPrint, Info, CheckCheck } from 'lucide-react';
import { getNotifications, markAsRead, markAllAsRead } from '@/lib/actions/notifications';

const typeIcons: Record<string, React.ReactNode> = {
  appointment: <Calendar className="h-4 w-4" />,
  invoice: <Receipt className="h-4 w-4" />,
  client: <Users className="h-4 w-4" />,
  patient: <PawPrint className="h-4 w-4" />,
  system: <Info className="h-4 w-4" />,
};

export default async function NotificationsPage() {
  const notifications = await getNotifications();
  const unread = notifications.filter((n) => !n.read).length;

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Notificaciones</h1>
          <p className="text-muted-foreground">
            {unread > 0 ? `${unread} sin leer` : 'Todas leídas'}
          </p>
        </div>
        {unread > 0 && (
          <form action={markAllAsRead}>
            <Button type="submit" variant="outline" size="sm">
              <CheckCheck className="mr-2 h-4 w-4" />Marcar todas leídas
            </Button>
          </form>
        )}
      </div>

      {notifications.length === 0 ? (
        <Card><CardContent className="flex flex-col items-center gap-2 py-12 text-center">
          <Bell className="h-12 w-12 text-muted-foreground/50" />
          <p className="text-muted-foreground">No hay notificaciones.</p>
        </CardContent></Card>
      ) : (
        <div className="space-y-2">
          {notifications.map((n) => (
            <Card key={n.id} className={`transition-colors ${!n.read ? 'border-primary/30 bg-primary/5' : ''}`}>
              <CardContent className="flex items-start gap-3 p-4">
                <div className={`mt-0.5 flex h-8 w-8 items-center justify-center rounded-full ${
                  !n.read ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'
                }`}>
                  {typeIcons[n.type]}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium">{n.title}</p>
                    {!n.read && <span className="h-2 w-2 rounded-full bg-primary shrink-0" />}
                  </div>
                  <p className="text-sm text-muted-foreground">{n.message}</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {new Date(n.createdAt).toLocaleDateString('es-ES', {
                      day: 'numeric', month: 'short', year: 'numeric',
                      hour: '2-digit', minute: '2-digit',
                    })}
                  </p>
                </div>
                <div className="flex flex-col gap-1 shrink-0">
                  {n.link && (
                    <Button asChild variant="ghost" size="sm">
                      <Link href={n.link}>Ver</Link>
                    </Button>
                  )}
                  {!n.read && (
                    <form action={async () => { 'use server'; await markAsRead(n.id); }}>
                      <Button type="submit" variant="ghost" size="sm" className="text-xs">
                        Leído
                      </Button>
                    </form>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
