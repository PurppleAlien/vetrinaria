'use server';

import { db, schema } from '@vetrinaria/db';
import { eq, desc } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

const clinicSchema = z.object({
  name: z.string().min(1, 'El nombre es obligatorio'),
  slug: z.string().min(1, 'El slug es obligatorio').regex(/^[a-z0-9-]+$/, 'Solo minúsculas, números y guiones'),
  email: z.string().email().optional().or(z.literal('')),
  phone: z.string().optional(),
  address: z.string().optional(),
});

export type ClinicInput = z.infer<typeof clinicSchema>;

export async function getClinics() {
  return db.select().from(schema.clinics).orderBy(desc(schema.clinics.createdAt));
}

export async function getClinic(id: number) {
  return db.select().from(schema.clinics).where(eq(schema.clinics.id, id)).then(r => r[0] ?? null);
}

export async function createClinic(data: ClinicInput) {
  const parsed = clinicSchema.parse(data);
  await db.insert(schema.clinics).values({
    name: parsed.name,
    slug: parsed.slug,
    email: parsed.email || null,
    phone: parsed.phone || null,
    address: parsed.address || null,
  });
  revalidatePath('/settings/clinics');
}

export async function updateClinic(id: number, data: ClinicInput) {
  const parsed = clinicSchema.parse(data);
  await db.update(schema.clinics).set({
    name: parsed.name,
    slug: parsed.slug,
    email: parsed.email || null,
    phone: parsed.phone || null,
    address: parsed.address || null,
  }).where(eq(schema.clinics.id, id));
  revalidatePath('/settings/clinics');
  revalidatePath(`/settings/clinics/${id}/edit`);
}
