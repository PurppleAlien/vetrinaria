import { pgTable, serial, text, integer, timestamp, date, index } from 'drizzle-orm/pg-core';
import { patients } from './patients';
import { clinics } from './clinics';
import { vaccines } from './vaccines';
import { users } from './users';
import { relations } from 'drizzle-orm';

export const vaccinationRecords = pgTable('vaccination_records', {
  id: serial('id').primaryKey(),
  clinicId: integer('clinic_id').notNull().references(() => clinics.id),
  patientId: integer('patient_id').notNull().references(() => patients.id),
  vaccineId: integer('vaccine_id').notNull().references(() => vaccines.id),
  appliedDate: date('applied_date').notNull(),
  nextDueDate: date('next_due_date'),
  batchNumber: text('batch_number'),
  applicationSite: text('application_site'),
  doseNumber: integer('dose_number').default(1),
  administeredBy: integer('administered_by').references(() => users.id),
  notes: text('notes'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
}, (table) => ({
  clinicIdx: index('vaccination_records_clinic_id_idx').on(table.clinicId),
  patientIdx: index('vaccination_records_patient_id_idx').on(table.patientId),
  vaccineIdx: index('vaccination_records_vaccine_id_idx').on(table.vaccineId),
  patientDueIdx: index('vaccination_records_patient_due_idx').on(table.patientId, table.nextDueDate),
}));

export const vaccinationRecordsRelations = relations(vaccinationRecords, ({ one }) => ({
  patient: one(patients, {
    fields: [vaccinationRecords.patientId],
    references: [patients.id],
  }),
  vaccine: one(vaccines, {
    fields: [vaccinationRecords.vaccineId],
    references: [vaccines.id],
  }),
  administeredByUser: one(users, {
    fields: [vaccinationRecords.administeredBy],
    references: [users.id],
  }),
}));
