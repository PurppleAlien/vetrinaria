import 'server-only';
import { cache } from 'react';
import { db, schema } from '@vetrinaria/db';
import { and, eq, sql, desc } from 'drizzle-orm';
import { getCurrentClinicId } from '@/lib/clinic';

export type VaccinationWithDetails = {
  id: number;
  patientId: number;
  vaccineId: number;
  vaccineName: string;
  vaccineSpecies: string;
  appliedDate: string;
  nextDueDate: string | null;
  batchNumber: string | null;
  applicationSite: string | null;
  doseNumber: number | null;
  administeredByName: string | null;
  notes: string | null;
  patientName: string;
  patientSpecies: string;
  patientBreed: string | null;
  patientGender: string;
  patientClientName: string;
  createdAt: string;
};

export type PatientVaccinationSummary = {
  patientId: number;
  patientName: string;
  patientSpecies: string;
  patientBreed: string | null;
  patientGender: string;
  patientClientName: string;
  lastVaccineDate: string | null;
  nextDueDate: string | null;
  vaccineCount: number;
};

const getVaccinationsByPatient = cache(
  async (patientId: number): Promise<VaccinationWithDetails[]> => {
    const rows = await db
      .select({
        id: schema.vaccinationRecords.id,
        patientId: schema.vaccinationRecords.patientId,
        vaccineId: schema.vaccinationRecords.vaccineId,
        vaccineName: schema.vaccines.name,
        vaccineSpecies: schema.vaccines.species,
        appliedDate: schema.vaccinationRecords.appliedDate,
        nextDueDate: schema.vaccinationRecords.nextDueDate,
        batchNumber: schema.vaccinationRecords.batchNumber,
        applicationSite: schema.vaccinationRecords.applicationSite,
        doseNumber: schema.vaccinationRecords.doseNumber,
        adminFirstName: schema.users.firstName,
        adminLastName: schema.users.lastName,
        notes: schema.vaccinationRecords.notes,
        patientName: schema.patients.name,
        patientSpecies: schema.patients.species,
        patientBreed: schema.patients.breed,
        patientGender: schema.patients.gender,
        clientName: schema.clients.name,
        createdAt: schema.vaccinationRecords.createdAt,
      })
      .from(schema.vaccinationRecords)
      .innerJoin(schema.patients, eq(schema.patients.id, schema.vaccinationRecords.patientId))
      .innerJoin(schema.clients, eq(schema.clients.id, schema.patients.clientId))
      .innerJoin(schema.vaccines, eq(schema.vaccines.id, schema.vaccinationRecords.vaccineId))
      .leftJoin(schema.users, eq(schema.users.id, schema.vaccinationRecords.administeredBy))
      .where(eq(schema.vaccinationRecords.patientId, patientId))
      .orderBy(desc(schema.vaccinationRecords.appliedDate));

    return rows.map((r) => ({
      id: r.id,
      patientId: r.patientId,
      vaccineId: r.vaccineId,
      vaccineName: r.vaccineName,
      vaccineSpecies: r.vaccineSpecies,
      appliedDate: String(r.appliedDate).split('T')[0],
      nextDueDate: r.nextDueDate ? String(r.nextDueDate).split('T')[0] : null,
      batchNumber: r.batchNumber,
      applicationSite: r.applicationSite,
      doseNumber: r.doseNumber,
      administeredByName: r.adminFirstName && r.adminLastName ? `${r.adminFirstName} ${r.adminLastName}` : null,
      notes: r.notes,
      patientName: r.patientName,
      patientSpecies: r.patientSpecies,
      patientBreed: r.patientBreed,
      patientGender: r.patientGender,
      patientClientName: r.clientName,
      createdAt: String(r.createdAt),
    }));
  }
);

export async function getVaccinations(patientId?: number): Promise<VaccinationWithDetails[] | PatientVaccinationSummary[]> {
  if (patientId) {
    return getVaccinationsByPatient(patientId);
  }

  const clinicId = await getCurrentClinicId();

  const rows = await db
    .select({
      patientId: schema.patients.id,
      patientName: schema.patients.name,
      patientSpecies: schema.patients.species,
      patientBreed: schema.patients.breed,
      patientGender: schema.patients.gender,
      clientName: schema.clients.name,
      lastVaccineDate: sql<string | null>`max(${schema.vaccinationRecords.appliedDate})`,
      nextDueDate: sql<string | null>`min(${schema.vaccinationRecords.nextDueDate})`,
      vaccineCount: sql<number>`count(${schema.vaccinationRecords.id})::int`,
    })
    .from(schema.patients)
    .innerJoin(schema.clients, eq(schema.clients.id, schema.patients.clientId))
    .leftJoin(schema.vaccinationRecords, eq(schema.vaccinationRecords.patientId, schema.patients.id))
    .where(and(eq(schema.patients.clinicId, clinicId), eq(schema.patients.active, true)))
    .groupBy(schema.patients.id, schema.clients.id)
    .orderBy(schema.patients.name);

  return rows.map((r) => ({
    patientId: r.patientId,
    patientName: r.patientName,
    patientSpecies: r.patientSpecies,
    patientBreed: r.patientBreed,
    patientGender: r.patientGender,
    patientClientName: r.clientName,
    lastVaccineDate: r.lastVaccineDate ? String(r.lastVaccineDate).split('T')[0] : null,
    nextDueDate: r.nextDueDate ? String(r.nextDueDate).split('T')[0] : null,
    vaccineCount: r.vaccineCount,
  }));
}
