import { pgTable, serial, text, timestamp, boolean, integer, index } from 'drizzle-orm/pg-core';
import { clinics } from './clinics';

export const userRoleEnum = ['super_admin', 'admin', 'veterinarian', 'technician', 'receptionist'] as const;
export type UserRole = (typeof userRoleEnum)[number];

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  clinicId: integer('clinic_id').notNull().references(() => clinics.id),
  email: text('email').notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  firstName: text('first_name').notNull(),
  lastName: text('last_name').notNull(),
  phone: text('phone'),
  role: text('role', { enum: userRoleEnum }).notNull().default('receptionist'),
  active: boolean('active').notNull().default(true),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
}, (table) => ({
  clinicIdx: index('users_clinic_id_idx').on(table.clinicId),
  emailIdx: index('users_email_idx').on(table.email),
  roleIdx: index('users_role_idx').on(table.role),
}));
