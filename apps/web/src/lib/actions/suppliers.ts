'use server';

import { db, schema } from '@vetrinaria/db';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { getCurrentClinicId } from '@/lib/clinic';

export interface SupplierInput {
  name: string;
  contact: string;
  email: string;
  phone: string;
  address: string;
}

export async function getSuppliers() {
  const clinicId = await getCurrentClinicId();
  return db
    .select()
    .from(schema.suppliers)
    .where(eq(schema.suppliers.clinicId, clinicId))
    .orderBy(schema.suppliers.name);
}

export async function getSupplier(id: number) {
  return db
    .select()
    .from(schema.suppliers)
    .where(eq(schema.suppliers.id, id))
    .then((r) => r[0] ?? null);
}

export async function createSupplier(data: SupplierInput) {
  const clinicId = await getCurrentClinicId();
  await db.insert(schema.suppliers).values({
    clinicId,
    name: data.name,
    contact: data.contact || null,
    email: data.email || null,
    phone: data.phone || null,
    address: data.address || null,
  });
  revalidatePath('/suppliers');
}

export async function updateSupplier(id: number, data: SupplierInput) {
  const clinicId = await getCurrentClinicId();
  await db
    .update(schema.suppliers)
    .set({
      clinicId,
      name: data.name,
      contact: data.contact || null,
      email: data.email || null,
      phone: data.phone || null,
      address: data.address || null,
    })
    .where(eq(schema.suppliers.id, id));
  revalidatePath('/suppliers');
  revalidatePath(`/suppliers/${id}`);
}
