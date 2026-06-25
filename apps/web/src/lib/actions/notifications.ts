'use server';

import { db, schema } from '@vetrinaria/db';
import { eq, and, desc, sql } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { auth } from '@/lib/auth';

interface CreateNotificationInput {
  userId: number;
  title: string;
  message: string;
  type: 'appointment' | 'invoice' | 'client' | 'patient' | 'system';
  link?: string;
}

export async function createNotification(data: CreateNotificationInput) {
  await db.insert(schema.notifications).values({
    userId: data.userId,
    title: data.title,
    message: data.message,
    type: data.type,
    link: data.link || null,
  });
  revalidatePath('/');
}

export async function getNotifications() {
  const session = await auth();
  if (!session?.user?.id) return [];

  const rows = await db
    .select()
    .from(schema.notifications)
    .where(eq(schema.notifications.userId, Number(session.user.id)))
    .orderBy(desc(schema.notifications.createdAt))
    .limit(50);

  return rows;
}

export async function getUnreadCount(): Promise<number> {
  const session = await auth();
  if (!session?.user?.id) return 0;

  const result = await db
    .select({ count: sql<number>`count(*)` })
    .from(schema.notifications)
    .where(and(
      eq(schema.notifications.userId, Number(session.user.id)),
      eq(schema.notifications.read, false),
    ))
    .then(r => Number(r[0]?.count ?? 0));

  return result;
}

export async function markAsRead(id: number) {
  const session = await auth();
  if (!session?.user?.id) return;

  await db
    .update(schema.notifications)
    .set({ read: true })
    .where(and(
      eq(schema.notifications.id, id),
      eq(schema.notifications.userId, Number(session.user.id)),
    ));

  revalidatePath('/notifications');
}

export async function markAllAsRead() {
  const session = await auth();
  if (!session?.user?.id) return;

  await db
    .update(schema.notifications)
    .set({ read: true })
    .where(and(
      eq(schema.notifications.userId, Number(session.user.id)),
      eq(schema.notifications.read, false),
    ));

  revalidatePath('/notifications');
}

export async function notifyNewAppointment(data: {
  clientName: string;
  patientName: string;
  date: string;
  time: string;
  vetIds: number[];
}) {
  const title = 'Nueva cita programada';
  const message = `${data.clientName} agendó cita para ${data.patientName} el ${data.date} a las ${data.time}`;
  const link = '/appointments';

  const admins = await db
    .select({ id: schema.users.id })
    .from(schema.users)
    .where(eq(schema.users.role, 'admin'));

  const allIds = [...new Set([...data.vetIds, ...admins.map(a => a.id)])];

  if (allIds.length > 0) {
    await db.insert(schema.notifications).values(
      allIds.map(userId => ({
        userId,
        title,
        message,
        type: 'appointment' as const,
        link,
      }))
    );
  }

  revalidatePath('/');
}

export async function notifyNewInvoice(data: {
  invoiceNumber: string;
  clientName: string;
  total: string;
  userIds: number[];
}) {
  if (data.userIds.length === 0) return;

  const title = 'Nueva factura emitida';
  const message = `Factura ${data.invoiceNumber} — ${data.clientName} — $${data.total}`;
  const link = '/invoices';

  await db.insert(schema.notifications).values(
    data.userIds.map(userId => ({
      userId,
      title,
      message,
      type: 'invoice' as const,
      link,
    }))
  );

  revalidatePath('/');
}
