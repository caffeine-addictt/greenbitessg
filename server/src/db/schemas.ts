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
  AnyPgColumn,
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
export type InsertUser = typeof usersTable.$inferInsert;
export type SelectUser = typeof usersTable.$inferSelect;

/**
 * JWT token blocklist
 */
export const jwtTokenBlocklist = pgTable('jwt_token_blocklist', {
  jti: text('jti').notNull().primaryKey(),
  exp: timestamp('expired_at').notNull(),
  userId: serial('user_id')
    .notNull()
    .references((): AnyPgColumn => usersTable.id),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at')
    .notNull()
    .$onUpdate(() => new Date()),
});
export type InsertJwtTokenBlocklist = typeof jwtTokenBlocklist.$inferInsert;
export type SelectJwtTokenBlocklist = typeof jwtTokenBlocklist.$inferSelect;

/**
 * Tokens
 */
export const tokens = pgTable('tokens', {
  token: uuid('token').defaultRandom().primaryKey(),
  tokenType: text('token_type').$type<TokenType>().notNull(),
  userId: integer('user_id')
    .notNull()
    .references((): AnyPgColumn => usersTable.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at')
    .notNull()
    .$onUpdate(() => new Date()),
});
export const tokensRelations = relations(tokens, ({ one }) => ({
  user: one(usersTable, {
    fields: [tokens.userId],
    references: [usersTable.id],
  }),
}));
export type TokenType = 'verification' | 'activation';
export type InsertToken = typeof tokens.$inferInsert;
export type SelectToken = typeof tokens.$inferSelect;
