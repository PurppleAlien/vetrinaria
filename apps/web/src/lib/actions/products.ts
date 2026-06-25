'use server';

import { db, schema } from '@vetrinaria/db';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { getCurrentClinicId } from '@/lib/clinic';

export interface ProductInput {
  name: string;
  description: string;
  type: string;
  sku: string;
  price: string;
  costPrice: string;
  stockQuantity: number;
  reorderPoint: number;
}

export async function getProducts() {
  const clinicId = await getCurrentClinicId();
  return db
    .select()
    .from(schema.products)
    .where(eq(schema.products.clinicId, clinicId))
    .orderBy(schema.products.name);
}

export async function getProduct(id: number) {
  return db
    .select()
    .from(schema.products)
    .where(eq(schema.products.id, id))
    .then((r) => r[0] ?? null);
}

export async function createProduct(data: ProductInput) {
  const clinicId = await getCurrentClinicId();
  await db.insert(schema.products).values({
    clinicId,
    name: data.name,
    description: data.description || null,
    type: data.type as any,
    sku: data.sku || null,
    price: data.price,
    costPrice: data.costPrice || null,
    stockQuantity: data.stockQuantity,
    reorderPoint: data.reorderPoint || null,
  });
  revalidatePath('/inventory');
}

export async function updateProduct(id: number, data: ProductInput) {
  const clinicId = await getCurrentClinicId();
  await db
    .update(schema.products)
    .set({
      clinicId,
      name: data.name,
      description: data.description || null,
      type: data.type as any,
      sku: data.sku || null,
      price: data.price,
      costPrice: data.costPrice || null,
      stockQuantity: data.stockQuantity,
      reorderPoint: data.reorderPoint || null,
    })
    .where(eq(schema.products.id, id));
  revalidatePath('/inventory');
  revalidatePath(`/inventory/${id}`);
}
