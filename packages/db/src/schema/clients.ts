import { pgTable, serial, text, timestamp, boolean, jsonb, integer, index } from 'drizzle-orm/pg-core';
import { clinics } from './clinics';

export const clients = pgTable('clients', {
  clinicId: integer('clinic_id').notNull().references(() => clinics.id),
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email'),
  phone: text('phone').notNull(),
  address: text('address'),
  emergencyContact: text('emergency_contact'),
  notes: text('notes'),
  metadata: jsonb('metadata'),
  active: boolean('active').notNull().default(true),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
}, (table) => ({
  clinicIdx: index('clients_clinic_id_idx').on(table.clinicId),
  emailIdx: index('clients_email_idx').on(table.email),
  phoneIdx: index('clients_phone_idx').on(table.phone),
  nameIdx: index('clients_name_idx').on(table.name),
}));
