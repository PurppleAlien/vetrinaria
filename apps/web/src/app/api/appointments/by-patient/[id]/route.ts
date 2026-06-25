import { db, schema } from '@vetrinaria/db';
import { eq } from 'drizzle-orm';

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const appointments = await db
    .select({ id: schema.appointments.id, date: schema.appointments.date, startTime: schema.appointments.startTime })
    .from(schema.appointments)
    .where(eq(schema.appointments.patientId, Number(id)))
    .orderBy(schema.appointments.date);

  return Response.json(appointments);
}
