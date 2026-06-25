import { pgTable, serial, integer, jsonb, timestamp, index } from 'drizzle-orm/pg-core';
import { patients } from './patients';
import { users } from './users';
import { clinics } from './clinics';
import { relations } from 'drizzle-orm';

export type ToothStatusValue =
  | 'healthy'
  | 'fractured'
  | 'missing'
  | 'worn'
  | 'calculus'
  | 'gingivitis'
  | 'mobility'
  | 'retained_deciduous'
  | 'root_remnant'
  | 'caries'
  | 'pulp_exposure'
  | 'other';

export interface ToothCondition {
  toothNumber: number;
  status: ToothStatusValue;
  notes?: string;
}

export const dentalRecords = pgTable('dental_records', {
  id: serial('id').primaryKey(),
  clinicId: integer('clinic_id').notNull().references(() => clinics.id),
  patientId: integer('patient_id').notNull().references(() => patients.id),
  teeth: jsonb('teeth').$type<ToothCondition[]>().default([]),
  notes: jsonb('notes').$type<Record<string, string>>().default({}),
  createdBy: integer('created_by').references(() => users.id),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
}, (table) => ({
  clinicIdx: index('dental_records_clinic_id_idx').on(table.clinicId),
  patientIdx: index('dental_records_patient_id_idx').on(table.patientId),
}));

export const dentalRecordsRelations = relations(dentalRecords, ({ one }) => ({
  patient: one(patients, {
    fields: [dentalRecords.patientId],
    references: [patients.id],
  }),
  createdByUser: one(users, {
    fields: [dentalRecords.createdBy],
    references: [users.id],
  }),
}));
