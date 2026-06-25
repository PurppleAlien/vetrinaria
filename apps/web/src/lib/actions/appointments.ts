'use server';

import { db, schema } from '@vetrinaria/db';
import { eq, and, gte, lte } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { notifyNewAppointment } from './notifications';
import { getCurrentClinicId } from '@/lib/clinic';

export interface AppointmentInput {
  patientId: number;
  clientId: number;
  vetId: number | null;
  date: string;
  startTime: string;
  endTime: string;
  type: string;
  notes: string;
  room: string;
}

export async function getAppointments(date?: string) {
  const clinicId = await getCurrentClinicId();
  const conditions = [eq(schema.appointments.clinicId, clinicId)];
  if (date) {
    conditions.push(eq(schema.appointments.date, date));
  }

  const rows = await db
    .select({
      id: schema.appointments.id,
      date: schema.appointments.date,
      startTime: schema.appointments.startTime,
      endTime: schema.appointments.endTime,
      type: schema.appointments.type,
      status: schema.appointments.status,
      notes: schema.appointments.notes,
      room: schema.appointments.room,
      patientId: schema.appointments.patientId,
      patientName: schema.patients.name,
      patientSpecies: schema.patients.species,
      clientId: schema.appointments.clientId,
      clientName: schema.clients.name,
      vetId: schema.appointments.vetId,
      vetName: schema.users.firstName,
      vetLastName: schema.users.lastName,
    })
    .from(schema.appointments)
    .innerJoin(schema.patients, eq(schema.appointments.patientId, schema.patients.id))
    .innerJoin(schema.clients, eq(schema.appointments.clientId, schema.clients.id))
    .leftJoin(schema.users, eq(schema.appointments.vetId, schema.users.id))
    .where(conditions.length > 0 ? and(...conditions) : undefined)
    .orderBy(schema.appointments.date, schema.appointments.startTime);

  return rows;
}

export async function getAppointment(id: number) {
  const row = await db
    .select({
      id: schema.appointments.id,
      date: schema.appointments.date,
      startTime: schema.appointments.startTime,
      endTime: schema.appointments.endTime,
      type: schema.appointments.type,
      status: schema.appointments.status,
      notes: schema.appointments.notes,
      room: schema.appointments.room,
      createdAt: schema.appointments.createdAt,
      patientId: schema.appointments.patientId,
      patientName: schema.patients.name,
      patientSpecies: schema.patients.species,
      patientBreed: schema.patients.breed,
      clientId: schema.appointments.clientId,
      clientName: schema.clients.name,
      clientPhone: schema.clients.phone,
      vetId: schema.appointments.vetId,
      vetName: schema.users.firstName,
      vetLastName: schema.users.lastName,
    })
    .from(schema.appointments)
    .innerJoin(schema.patients, eq(schema.appointments.patientId, schema.patients.id))
    .innerJoin(schema.clients, eq(schema.appointments.clientId, schema.clients.id))
    .leftJoin(schema.users, eq(schema.appointments.vetId, schema.users.id))
    .where(eq(schema.appointments.id, id))
    .then((rows) => rows[0] ?? null);

  return row;
}

export async function createAppointment(data: AppointmentInput) {
  const clinicId = await getCurrentClinicId();
  await db.insert(schema.appointments).values({
    clinicId,
    patientId: data.patientId,
    clientId: data.clientId,
    vetId: data.vetId,
    date: data.date,
    startTime: data.startTime,
    endTime: data.endTime,
    type: data.type as any,
    status: 'scheduled',
    notes: data.notes || null,
    room: data.room || null,
  });

  const [patient, client] = await Promise.all([
    db.select({ name: schema.patients.name }).from(schema.patients).where(eq(schema.patients.id, data.patientId)).then(r => r[0]),
    db.select({ name: schema.clients.name }).from(schema.clients).where(eq(schema.clients.id, data.clientId)).then(r => r[0]),
  ]);

  const vetIds = data.vetId ? [data.vetId] : [];
  await notifyNewAppointment({
    clientName: client?.name ?? 'Cliente',
    patientName: patient?.name ?? 'Mascota',
    date: data.date,
    time: data.startTime.slice(0, 5),
    vetIds,
  });

  revalidatePath('/appointments');
}

export async function updateAppointment(id: number, data: AppointmentInput) {
  await db
    .update(schema.appointments)
    .set({
      patientId: data.patientId,
      clientId: data.clientId,
      vetId: data.vetId,
      date: data.date,
      startTime: data.startTime,
      endTime: data.endTime,
      type: data.type as any,
      notes: data.notes || null,
      room: data.room || null,
    })
    .where(eq(schema.appointments.id, id));
  revalidatePath('/appointments');
  revalidatePath(`/appointments/${id}`);
}

export async function updateAppointmentStatus(id: number, status: string) {
  await db
    .update(schema.appointments)
    .set({ status: status as any })
    .where(eq(schema.appointments.id, id));
  revalidatePath('/appointments');
  revalidatePath(`/appointments/${id}`);
}
