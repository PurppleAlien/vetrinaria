import { db, schema } from '@vetrinaria/db';
import { eq } from 'drizzle-orm';

export async function GET() {
  const vets = await db
    .select({ id: schema.users.id, firstName: schema.users.firstName, lastName: schema.users.lastName })
    .from(schema.users)
    .where(eq(schema.users.active, true))
    .orderBy(schema.users.firstName);

  const mapped = vets.map((v) => ({ id: v.id, name: `${v.firstName} ${v.lastName}` }));
  return Response.json(mapped);
}
