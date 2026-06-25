import { pgTable, serial, text, integer, decimal, boolean, timestamp, index } from 'drizzle-orm/pg-core';
import { suppliers } from './suppliers';
import { clinics } from './clinics';

export const productTypeEnum = ['medication', 'supply', 'food', 'service'] as const;

export const products = pgTable('products', {
  id: serial('id').primaryKey(),
  clinicId: integer('clinic_id').notNull().references(() => clinics.id),
  name: text('name').notNull(),
  description: text('description'),
  type: text('type', { enum: productTypeEnum }).notNull(),
  sku: text('sku').unique(),
  price: decimal('price', { precision: 10, scale: 2 }).notNull(),
  costPrice: decimal('cost_price', { precision: 10, scale: 2 }),
  stockQuantity: integer('stock_quantity').notNull().default(0),
  reorderPoint: integer('reorder_point').default(10),
  active: boolean('active').notNull().default(true),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
}, (table) => ({
  clinicIdx: index('products_clinic_id_idx').on(table.clinicId),
  nameIdx: index('products_name_idx').on(table.name),
  typeIdx: index('products_type_idx').on(table.type),
}));
