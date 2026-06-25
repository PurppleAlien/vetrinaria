import { pgTable, serial, text, timestamp, boolean, jsonb, index } from 'drizzle-orm/pg-core';

export const clinics = pgTable('clinics', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  slug: text('slug').notNull().unique(),
  email: text('email'),
  phone: text('phone'),
  address: text('address'),
  settings: jsonb('settings').$type<{
    theme?: string;
    locale?: string;
    timezone?: string;
    invoicePrefix?: string;
    taxRate?: number;
  }>().default({}),
  active: boolean('active').notNull().default(true),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
}, (table) => ({
  activeIdx: index('clinics_active_idx').on(table.active),
}));
