/**
 * SPDX-FileCopyrightText: 2024 Ng Jun Xiang <contact@ngjx.org>
 *
 * SPDX-License-Identifier: GPL-3.0-only
 */

import {
  pgTable,
  serial,
  text,
  timestamp,
  date,
  smallint,
} from 'drizzle-orm/pg-core';

/**
 * Permission:
 * 0 - normal user
 * 1 - admin user
 */
export const usersTable = pgTable('users_table', {
  id: serial('id').primaryKey(),
  permission: smallint('permission').default(0).notNull(),
  username: text('username').notNull(),
  email: text('email').notNull().unique(),
  dateOfBirth: date('date_of_birth').notNull(),
  password: text('password').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at')
    .notNull()
    .$onUpdate(() => new Date()),
});

// Export types
export type InsertUser = typeof usersTable.$inferInsert;
export type SelectUser = typeof usersTable.$inferSelect;
