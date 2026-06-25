import { db, schema } from '@vetrinaria/db';
import { eq } from 'drizzle-orm';

export async function GET() {
  const clients = await db
    .select({ id: schema.clients.id, name: schema.clients.name })
    .from(schema.clients)
    .where(eq(schema.clients.active, true))
    .orderBy(schema.clients.name);

  return Response.json(clients);
}
