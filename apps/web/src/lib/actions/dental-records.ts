'use server';

import { db, schema } from '@vetrinaria/db';
import { eq, desc } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { getCurrentClinicId } from '@/lib/clinic';
import type { ToothCondition } from '@vetrinaria/shared/types';

export async function getDentalRecords(patientId: number) {
  return db
    .select({
      id: schema.dentalRecords.id,
      patientId: schema.dentalRecords.patientId,
      teeth: schema.dentalRecords.teeth,
      notes: schema.dentalRecords.notes,
      createdBy: schema.dentalRecords.createdBy,
      createdAt: schema.dentalRecords.createdAt,
      updatedAt: schema.dentalRecords.updatedAt,
      createdByName: schema.users.firstName,
      createdByLastName: schema.users.lastName,
    })
    .from(schema.dentalRecords)
    .leftJoin(schema.users, eq(schema.dentalRecords.createdBy, schema.users.id))
    .where(eq(schema.dentalRecords.patientId, patientId))
    .orderBy(desc(schema.dentalRecords.createdAt));
}

export async function getLatestDentalRecord(patientId: number) {
  const rows = await db
    .select({
      id: schema.dentalRecords.id,
      patientId: schema.dentalRecords.patientId,
      teeth: schema.dentalRecords.teeth,
      notes: schema.dentalRecords.notes,
      createdAt: schema.dentalRecords.createdAt,
      updatedAt: schema.dentalRecords.updatedAt,
      createdByName: schema.users.firstName,
      createdByLastName: schema.users.lastName,
    })
    .from(schema.dentalRecords)
    .leftJoin(schema.users, eq(schema.dentalRecords.createdBy, schema.users.id))
    .where(eq(schema.dentalRecords.patientId, patientId))
    .orderBy(desc(schema.dentalRecords.createdAt))
    .limit(1);

  return rows[0] ?? null;
}

export async function upsertDentalRecord(
  patientId: number,
  data: { teeth: ToothCondition[]; notes?: string },
) {
  const clinicId = await getCurrentClinicId();
  const existing = await db
    .select({ id: schema.dentalRecords.id })
    .from(schema.dentalRecords)
    .where(eq(schema.dentalRecords.patientId, patientId))
    .limit(1);

  if (existing[0]) {
    await db
      .update(schema.dentalRecords)
      .set({
        teeth: data.teeth,
        notes: data.notes ? { general: data.notes } : undefined,
        updatedAt: new Date(),
      })
      .where(eq(schema.dentalRecords.id, existing[0].id));
  } else {
    await db.insert(schema.dentalRecords).values({
      clinicId,
      patientId,
      teeth: data.teeth,
      notes: data.notes ? { general: data.notes } : {},
    });
  }

  revalidatePath(`/patients/${patientId}`);
  revalidatePath(`/odontogram/${patientId}`);
}

export async function getDentalToothSummary(patientId: number) {
  const record = await getLatestDentalRecord(patientId);
  if (!record) return [];
  return record.teeth;
}
