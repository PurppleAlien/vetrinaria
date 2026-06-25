'use server';

import { db, schema } from '@vetrinaria/db';
import { eq, and } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { createNotification } from './notifications';
import { getCurrentClinicId } from '@/lib/clinic';

const clientSchema = z.object({
  name: z.string().min(1, 'El nombre es obligatorio'),
  email: z.string().email('Email inválido').optional().or(z.literal('')),
  phone: z.string().min(1, 'El teléfono es obligatorio'),
  address: z.string().optional(),
  emergencyContact: z.string().optional(),
  notes: z.string().optional(),
});

export type ClientInput = z.infer<typeof clientSchema>;

export async function getClients(search?: string) {
  const clinicId = await getCurrentClinicId();
  const clinicFilter = eq(schema.clients.clinicId, clinicId);

  const rows = await db
    .select()
    .from(schema.clients)
    .where(
      search
        ? and(clinicFilter, eq(schema.clients.active, true))
        : clinicFilter,
    )
    .orderBy(schema.clients.name);

  if (search) {
    const pattern = `%${search.toLowerCase()}%`;
    return rows.filter(
      (c) =>
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.email?.toLowerCase().includes(search.toLowerCase()) ||
        c.phone.includes(search),
    );
  }

  return rows;
}

export async function getClient(id: number) {
  return db
    .select()
    .from(schema.clients)
    .where(eq(schema.clients.id, id))
    .then((rows) => rows[0] ?? null);
}

export async function createClient(data: ClientInput) {
  const parsed = clientSchema.parse(data);
  const clinicId = await getCurrentClinicId();

  await db.insert(schema.clients).values({
    clinicId,
    name: parsed.name,
    email: parsed.email || null,
    phone: parsed.phone,
    address: parsed.address || null,
    emergencyContact: parsed.emergencyContact || null,
    notes: parsed.notes || null,
  });

  // Notify all admins in same clinic
  const admins = await db
    .select({ id: schema.users.id })
    .from(schema.users)
    .where(and(eq(schema.users.role, 'admin'), eq(schema.users.clinicId, clinicId)));
  for (const admin of admins) {
    await createNotification({
      userId: admin.id,
      title: 'Nuevo cliente registrado',
      message: `${parsed.name} se registró como cliente`,
      type: 'client',
      link: '/clients',
    });
  }

  revalidatePath('/clients');
}

export async function updateClient(id: number, data: ClientInput) {
  const parsed = clientSchema.parse(data);

  await db
    .update(schema.clients)
    .set({
      name: parsed.name,
      email: parsed.email || null,
      phone: parsed.phone,
      address: parsed.address || null,
      emergencyContact: parsed.emergencyContact || null,
      notes: parsed.notes || null,
    })
    .where(eq(schema.clients.id, id));

  revalidatePath('/clients');
  revalidatePath(`/clients/${id}`);
}

export async function deleteClient(id: number) {
  await db.delete(schema.clients).where(eq(schema.clients.id, id));
  revalidatePath('/clients');
}
