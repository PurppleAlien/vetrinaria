'use server';

import { db, schema } from '@vetrinaria/db';
import { eq, and, desc } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { getCurrentClinicId } from '@/lib/clinic';

export interface PatientInput {
  clientId: number;
  name: string;
  species: string;
  breed: string;
  gender: string;
  birthDate: string;
  color: string;
  microchip: string;
  allergies: string;
  notes: string;
}

export async function getPatients() {
  const clinicId = await getCurrentClinicId();
  return db
    .select({
      id: schema.patients.id,
      name: schema.patients.name,
      species: schema.patients.species,
      breed: schema.patients.breed,
      gender: schema.patients.gender,
      birthDate: schema.patients.birthDate,
      active: schema.patients.active,
      createdAt: schema.patients.createdAt,
      clientId: schema.patients.clientId,
      clientName: schema.clients.name,
    })
    .from(schema.patients)
    .innerJoin(schema.clients, eq(schema.patients.clientId, schema.clients.id))
    .where(eq(schema.patients.clinicId, clinicId))
    .orderBy(desc(schema.patients.createdAt));
}

export async function getPatient(id: number) {
  const row = await db
    .select({
      id: schema.patients.id,
      clientId: schema.patients.clientId,
      name: schema.patients.name,
      species: schema.patients.species,
      breed: schema.patients.breed,
      gender: schema.patients.gender,
      birthDate: schema.patients.birthDate,
      color: schema.patients.color,
      weight: schema.patients.weight,
      microchip: schema.patients.microchip,
      photoUrl: schema.patients.photoUrl,
      allergies: schema.patients.allergies,
      notes: schema.patients.notes,
      active: schema.patients.active,
      createdAt: schema.patients.createdAt,
      updatedAt: schema.patients.updatedAt,
      clientName: schema.clients.name,
      clientPhone: schema.clients.phone,
      clientEmail: schema.clients.email,
    })
    .from(schema.patients)
    .innerJoin(schema.clients, eq(schema.patients.clientId, schema.clients.id))
    .where(eq(schema.patients.id, id))
    .then((rows) => rows[0] ?? null);

  return row;
}

export async function createPatient(data: PatientInput) {
  const clinicId = await getCurrentClinicId();
  await db.insert(schema.patients).values({
    clinicId,
    clientId: data.clientId,
    name: data.name,
    species: data.species as any,
    breed: data.breed || null,
    gender: data.gender as any,
    birthDate: data.birthDate || null,
    color: data.color || null,
    microchip: data.microchip || null,
    allergies: data.allergies || null,
    notes: data.notes || null,
  });
  revalidatePath('/patients');
}

export async function updatePatient(id: number, data: PatientInput) {
  await db
    .update(schema.patients)
    .set({
      clientId: data.clientId,
      name: data.name,
      species: data.species as any,
      breed: data.breed || null,
      gender: data.gender as any,
      birthDate: data.birthDate || null,
      color: data.color || null,
      microchip: data.microchip || null,
      allergies: data.allergies || null,
      notes: data.notes || null,
    })
    .where(eq(schema.patients.id, id));
  revalidatePath('/patients');
  revalidatePath(`/patients/${id}`);
}

export async function deletePatient(id: number) {
  await db.delete(schema.patients).where(eq(schema.patients.id, id));
  revalidatePath('/patients');
}
