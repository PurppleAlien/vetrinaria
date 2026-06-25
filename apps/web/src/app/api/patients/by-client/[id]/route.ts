import { db, schema } from '@vetrinaria/db';
import { eq } from 'drizzle-orm';

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const patients = await db
    .select({ id: schema.patients.id, name: schema.patients.name, species: schema.patients.species })
    .from(schema.patients)
    .where(eq(schema.patients.clientId, Number(id)))
    .orderBy(schema.patients.name);

  return Response.json(patients);
}
