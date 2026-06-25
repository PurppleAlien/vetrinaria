import { pgTable, serial, text, timestamp, integer, date, time, index } from 'drizzle-orm/pg-core';
import { clients } from './clients';
import { patients } from './patients';
import { users } from './users';
import { clinics } from './clinics';
import { relations } from 'drizzle-orm';

export const appointmentStatusEnum = [
  'scheduled', 'confirmed', 'checked_in', 'in_exam',
  'checked_out', 'cancelled', 'no_show',
] as const;

export const appointmentTypeEnum = [
  'consultation', 'vaccination', 'surgery', 'emergency',
  'grooming', 'boarding', 'follow_up', 'other',
] as const;

export const appointments = pgTable('appointments', {
  id: serial('id').primaryKey(),
  clinicId: integer('clinic_id').notNull().references(() => clinics.id),
  patientId: integer('patient_id').notNull().references(() => patients.id),
  clientId: integer('client_id').notNull().references(() => clients.id),
  vetId: integer('vet_id').references(() => users.id),
  date: date('date').notNull(),
  startTime: time('start_time').notNull(),
  endTime: time('end_time').notNull(),
  type: text('type', { enum: appointmentTypeEnum }).notNull().default('consultation'),
  status: text('status', { enum: appointmentStatusEnum }).notNull().default('scheduled'),
  notes: text('notes'),
  room: text('room'),
  createdBy: integer('created_by').references(() => users.id),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
}, (table) => ({
  clinicIdx: index('appointments_clinic_id_idx').on(table.clinicId),
  patientIdx: index('appointments_patient_id_idx').on(table.patientId),
  clientIdx: index('appointments_client_id_idx').on(table.clientId),
  vetIdx: index('appointments_vet_id_idx').on(table.vetId),
  dateIdx: index('appointments_date_idx').on(table.date),
  statusIdx: index('appointments_status_idx').on(table.status),
  dateStatusIdx: index('appointments_date_status_idx').on(table.date, table.status),
  startTimeIdx: index('appointments_start_time_idx').on(table.startTime),
}));

export const appointmentsRelations = relations(appointments, ({ one }) => ({
  patient: one(patients, {
    fields: [appointments.patientId],
    references: [patients.id],
  }),
  client: one(clients, {
    fields: [appointments.clientId],
    references: [clients.id],
  }),
  veterinarian: one(users, {
    fields: [appointments.vetId],
    references: [users.id],
  }),
}));
