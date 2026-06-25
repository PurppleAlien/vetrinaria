import { pgTable, serial, text, integer, timestamp, boolean, index } from 'drizzle-orm/pg-core';
import { users } from './users';

export const notifications = pgTable('notifications', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').notNull().references(() => users.id),
  title: text('title').notNull(),
  message: text('message').notNull(),
  type: text('type', { enum: ['appointment', 'invoice', 'client', 'patient', 'system'] }).notNull().default('system'),
  link: text('link'),
  read: boolean('read').notNull().default(false),
  createdAt: timestamp('created_at').notNull().defaultNow(),
}, (table) => ({
  userIdx: index('notifications_user_id_idx').on(table.userId),
  readIdx: index('notifications_read_idx').on(table.read),
  createdAtIdx: index('notifications_created_at_idx').on(table.createdAt),
  userReadIdx: index('notifications_user_read_idx').on(table.userId, table.read),
}));
