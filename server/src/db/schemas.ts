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
  integer,
  AnyPgColumn,
  uuid,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

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
export const usersRelations = relations(usersTable, ({ one, many }) => ({
  jwtTokenBlocklist: many(jwtTokenBlocklist),
  tokens: many(tokens),
  passkeyChallenge: one(passkeyChallengesTable, {
    fields: [usersTable.id],
    references: [passkeyChallengesTable.userId],
  }),
}));
export type InsertUser = typeof usersTable.$inferInsert;
export type SelectUser = typeof usersTable.$inferSelect;

/**
 * Passkey Challenges
 */
export const passkeyChallengesTable = pgTable('passkey_challenges_table', {
  challenge: text('challenge').notNull().primaryKey(),
  userId: integer('user_id')
    .notNull()
    .unique()
    .references((): AnyPgColumn => usersTable.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at')
    .notNull()
    .$onUpdate(() => new Date()),
});
export const passkeyChallengesRelations = relations(
  passkeyChallengesTable,
  ({ one }) => ({
    user: one(usersTable, {
      fields: [passkeyChallengesTable.userId],
      references: [usersTable.id],
    }),
  }),
);
export type InsertPasskeyChallenge = typeof passkeyChallengesTable.$inferInsert;
export type SelectPasskeyChallenge = typeof passkeyChallengesTable.$inferSelect;

/**
 * JWT token blocklist
 */
export const jwtTokenBlocklist = pgTable('jwt_token_blocklist', {
  jti: text('jti').notNull().primaryKey(),
  exp: timestamp('expired_at').notNull(),
  userId: integer('user_id')
    .notNull()
    .references((): AnyPgColumn => usersTable.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at')
    .notNull()
    .$onUpdate(() => new Date()),
});
export const jwtTokenBlocklistRelations = relations(
  jwtTokenBlocklist,
  ({ one }) => ({
    user: one(usersTable, {
      fields: [jwtTokenBlocklist.userId],
      references: [usersTable.id],
    }),
  }),
);
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
