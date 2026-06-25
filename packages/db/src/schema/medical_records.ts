import { pgTable, serial, text, timestamp, integer, jsonb, index } from 'drizzle-orm/pg-core';
import { appointments } from './appointments';
import { patients } from './patients';
import { users } from './users';
import { clinics } from './clinics';
import { relations } from 'drizzle-orm';

export const medicalRecords = pgTable('medical_records', {
  id: serial('id').primaryKey(),
  clinicId: integer('clinic_id').notNull().references(() => clinics.id),
  patientId: integer('patient_id').notNull().references(() => patients.id),
  appointmentId: integer('appointment_id').references(() => appointments.id),
  subjective: text('subjective'),
  objective: text('objective'),
  assessment: text('assessment'),
  plan: text('plan'),
  vitals: jsonb('vitals').$type<{
    weight?: number;
    temperature?: number;
    heartRate?: number;
    respiratoryRate?: number;
  }>().default({}),
  diagnosis: text('diagnosis'),
  createdBy: integer('created_by').references(() => users.id),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
}, (table) => ({
  clinicIdx: index('medical_records_clinic_id_idx').on(table.clinicId),
  patientIdx: index('medical_records_patient_id_idx').on(table.patientId),
  appointmentIdx: index('medical_records_appointment_id_idx').on(table.appointmentId),
  createdAtIdx: index('medical_records_created_at_idx').on(table.createdAt),
}));

export const medicalRecordsRelations = relations(medicalRecords, ({ one }) => ({
  patient: one(patients, {
    fields: [medicalRecords.patientId],
    references: [patients.id],
  }),
  appointment: one(appointments, {
    fields: [medicalRecords.appointmentId],
    references: [appointments.id],
  }),
  createdByUser: one(users, {
    fields: [medicalRecords.createdBy],
    references: [users.id],
  }),
}));
