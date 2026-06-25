import { pgTable, serial, text, integer, decimal, timestamp, boolean, index } from 'drizzle-orm/pg-core';
import { clients } from './clients';
import { appointments } from './appointments';
import { clinics } from './clinics';

export const invoiceStatusEnum = ['draft', 'issued', 'paid', 'cancelled'] as const;

export const invoices = pgTable('invoices', {
  id: serial('id').primaryKey(),
  clinicId: integer('clinic_id').notNull().references(() => clinics.id),
  clientId: integer('client_id').notNull().references(() => clients.id),
  appointmentId: integer('appointment_id').references(() => appointments.id),
  invoiceNumber: text('invoice_number').notNull().unique(),
  subtotal: decimal('subtotal', { precision: 10, scale: 2 }).notNull().default('0'),
  tax: decimal('tax', { precision: 10, scale: 2 }).notNull().default('0'),
  total: decimal('total', { precision: 10, scale: 2 }).notNull().default('0'),
  status: text('status', { enum: invoiceStatusEnum }).notNull().default('draft'),
  notes: text('notes'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
}, (table) => ({
  clinicIdx: index('invoices_clinic_id_idx').on(table.clinicId),
  clientIdx: index('invoices_client_id_idx').on(table.clientId),
  statusIdx: index('invoices_status_idx').on(table.status),
  createdAtIdx: index('invoices_created_at_idx').on(table.createdAt),
  clinicStatusIdx: index('invoices_clinic_status_idx').on(table.clinicId, table.status),
}));

export const invoiceItems = pgTable('invoice_items', {
  id: serial('id').primaryKey(),
  invoiceId: integer('invoice_id').notNull().references(() => invoices.id),
  description: text('description').notNull(),
  quantity: integer('quantity').notNull().default(1),
  unitPrice: decimal('unit_price', { precision: 10, scale: 2 }).notNull(),
  total: decimal('total', { precision: 10, scale: 2 }).notNull(),
});
