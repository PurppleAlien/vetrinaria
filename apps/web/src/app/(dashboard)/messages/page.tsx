import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { MessageSquare, Construction } from 'lucide-react';

export default function MessagesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Mensajes</h1>
        <p className="text-muted-foreground">Comunicación con clientes</p>
      </div>
      <Card>
        <CardContent className="flex flex-col items-center gap-4 py-16 text-center">
          <Construction className="h-16 w-16 text-muted-foreground/40" />
          <div>
            <h2 className="text-xl font-semibold">Módulo en construcción</h2>
            <p className="text-muted-foreground mt-1">
              La mensajería SMS, WhatsApp y email estará disponible en una próxima fase.
            </p>
          </div>
          <Button asChild variant="outline" size="sm">
            <Link href="/">Volver al Dashboard</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
