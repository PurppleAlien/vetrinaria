import { pgTable, serial, text, integer, boolean, index } from 'drizzle-orm/pg-core';
import { clinics } from './clinics';

export const vaccines = pgTable('vaccines', {
  id: serial('id').primaryKey(),
  clinicId: integer('clinic_id').notNull().references(() => clinics.id),
  name: text('name').notNull(),
  description: text('description'),
  species: text('species').notNull(),
  frequencyDays: integer('frequency_days').notNull().default(365),
  isCore: boolean('is_core').notNull().default(true),
  active: boolean('active').notNull().default(true),
}, (table) => ({
  clinicIdx: index('vaccines_clinic_id_idx').on(table.clinicId),
  speciesIdx: index('vaccines_species_idx').on(table.species),
}));
