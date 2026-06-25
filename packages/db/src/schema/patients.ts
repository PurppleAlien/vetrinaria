import { pgTable, serial, text, timestamp, date, integer, boolean, jsonb, index } from 'drizzle-orm/pg-core';
import { clients } from './clients';
import { clinics } from './clinics';
import { relations } from 'drizzle-orm';
import { vaccinationRecords } from './vaccination_records';

export const speciesEnum = ['dog', 'cat', 'rabbit', 'bird', 'reptile', 'other'] as const;
export const genderEnum = ['male', 'female'] as const;

export const patients = pgTable('patients', {
  id: serial('id').primaryKey(),
  clinicId: integer('clinic_id').notNull().references(() => clinics.id),
  clientId: integer('client_id').notNull().references(() => clients.id),
  name: text('name').notNull(),
  species: text('species', { enum: speciesEnum }).notNull(),
  breed: text('breed'),
  gender: text('gender', { enum: genderEnum }).notNull(),
  birthDate: date('birth_date'),
  color: text('color'),
  weight: jsonb('weight').$type<{ value: number; date: string }[]>().default([]),
  microchip: text('microchip'),
  photoUrl: text('photo_url'),
  allergies: text('allergies'),
  notes: text('notes'),
  active: boolean('active').notNull().default(true),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
}, (table) => ({
  clinicIdx: index('patients_clinic_id_idx').on(table.clinicId),
  clientIdx: index('patients_client_id_idx').on(table.clientId),
  nameIdx: index('patients_name_idx').on(table.name),
  speciesIdx: index('patients_species_idx').on(table.species),
}));

export const patientsRelations = relations(patients, ({ one, many }) => ({
  client: one(clients, {
    fields: [patients.clientId],
    references: [clients.id],
  }),
  vaccinationRecords: many(vaccinationRecords),
}));
