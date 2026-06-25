'use server';

import { db, schema } from '@vetrinaria/db';
import { eq, desc } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { getCurrentClinicId } from '@/lib/clinic';

export interface MedicalRecordInput {
  patientId: number;
  appointmentId: number | null;
  subjective: string;
  objective: string;
  assessment: string;
  plan: string;
  diagnosis: string;
  vitals: {
    weight?: number;
    temperature?: number;
    heartRate?: number;
    respiratoryRate?: number;
  };
}

export async function getMedicalRecords(patientId: number) {
  return db
    .select({
      id: schema.medicalRecords.id,
      diagnosis: schema.medicalRecords.diagnosis,
      createdAt: schema.medicalRecords.createdAt,
      patientId: schema.medicalRecords.patientId,
      appointmentId: schema.medicalRecords.appointmentId,
      appointmentDate: schema.appointments.date,
      createdByName: schema.users.firstName,
      createdByLastName: schema.users.lastName,
    })
    .from(schema.medicalRecords)
    .leftJoin(schema.appointments, eq(schema.medicalRecords.appointmentId, schema.appointments.id))
    .leftJoin(schema.users, eq(schema.medicalRecords.createdBy, schema.users.id))
    .where(eq(schema.medicalRecords.patientId, patientId))
    .orderBy(desc(schema.medicalRecords.createdAt));
}

export async function getMedicalRecord(id: number) {
  const row = await db
    .select({
      id: schema.medicalRecords.id,
      patientId: schema.medicalRecords.patientId,
      appointmentId: schema.medicalRecords.appointmentId,
      subjective: schema.medicalRecords.subjective,
      objective: schema.medicalRecords.objective,
      assessment: schema.medicalRecords.assessment,
      plan: schema.medicalRecords.plan,
      vitals: schema.medicalRecords.vitals,
      diagnosis: schema.medicalRecords.diagnosis,
      createdAt: schema.medicalRecords.createdAt,
      updatedAt: schema.medicalRecords.updatedAt,
      patientName: schema.patients.name,
      patientSpecies: schema.patients.species,
      clientName: schema.clients.name,
      appointmentDate: schema.appointments.date,
      createdByName: schema.users.firstName,
      createdByLastName: schema.users.lastName,
    })
    .from(schema.medicalRecords)
    .innerJoin(schema.patients, eq(schema.medicalRecords.patientId, schema.patients.id))
    .innerJoin(schema.clients, eq(schema.patients.clientId, schema.clients.id))
    .leftJoin(schema.appointments, eq(schema.medicalRecords.appointmentId, schema.appointments.id))
    .leftJoin(schema.users, eq(schema.medicalRecords.createdBy, schema.users.id))
    .where(eq(schema.medicalRecords.id, id))
    .then((rows) => rows[0] ?? null);

  return row;
}

export async function createMedicalRecord(data: MedicalRecordInput) {
  const clinicId = await getCurrentClinicId();
  await db.insert(schema.medicalRecords).values({
    clinicId,
    patientId: data.patientId,
    appointmentId: data.appointmentId || null,
    subjective: data.subjective || null,
    objective: data.objective || null,
    assessment: data.assessment || null,
    plan: data.plan || null,
    diagnosis: data.diagnosis || null,
    vitals: data.vitals,
  });
  revalidatePath(`/medical-records`);
  revalidatePath(`/patients/${data.patientId}`);
}

export async function updateMedicalRecord(id: number, data: MedicalRecordInput) {
  await db
    .update(schema.medicalRecords)
    .set({
      appointmentId: data.appointmentId || null,
      subjective: data.subjective || null,
      objective: data.objective || null,
      assessment: data.assessment || null,
      plan: data.plan || null,
      diagnosis: data.diagnosis || null,
      vitals: data.vitals,
    })
    .where(eq(schema.medicalRecords.id, id));
  revalidatePath(`/medical-records`);
  revalidatePath(`/medical-records/${id}`);
  revalidatePath(`/patients/${data.patientId}`);
}
