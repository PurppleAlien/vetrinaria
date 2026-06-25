import { pgTable, serial, text, boolean, timestamp, integer, index } from 'drizzle-orm/pg-core';
import { clinics } from './clinics';

export const suppliers = pgTable('suppliers', {
  clinicId: integer('clinic_id').notNull().references(() => clinics.id),
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  contact: text('contact'),
  email: text('email'),
  phone: text('phone'),
  address: text('address'),
  active: boolean('active').notNull().default(true),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
}, (table) => ({
  clinicIdx: index('suppliers_clinic_id_idx').on(table.clinicId),
  nameIdx: index('suppliers_name_idx').on(table.name),
}));
