import { NextResponse } from 'next/server';
import { db, schema } from '@vetrinaria/db';
import { eq, and, desc, sql } from 'drizzle-orm';
import { auth } from '@/lib/auth';

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  const [unread, recent] = await Promise.all([
    db
      .select({ count: sql<number>`count(*)` })
      .from(schema.notifications)
      .where(and(
        eq(schema.notifications.userId, Number(session.user.id)),
        eq(schema.notifications.read, false),
      ))
      .then(r => Number(r[0]?.count ?? 0)),
    db
      .select()
      .from(schema.notifications)
      .where(eq(schema.notifications.userId, Number(session.user.id)))
      .orderBy(desc(schema.notifications.createdAt))
      .limit(5),
  ]);

  return NextResponse.json({ unread, notifications: recent });
}
