/**
 * SPDX-FileCopyrightText: 2024 Ng Jun Xiang <contact@ngjx.org>
 *
 * SPDX-License-Identifier: GPL-3.0-only
 */

import {
  pgTable,
  time,
  serial,
  text,
  timestamp,
  smallint,
  integer,
  AnyPgColumn,
  uuid,
  customType,
  boolean,
  jsonb,
  date
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import type {
  AuthenticatorTransportFuture,
  CredentialDeviceType,
} from '@simplewebauthn/server/script/deps';

// Custom types
/** For binary data - Currently for storing Unit8Array publicKey */
export const bytea = customType<{
  data: Buffer;
  notNull: false;
  default: false;
}>({
  dataType: () => 'bytea',
});

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
  password: text('password').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at')
    .notNull()
    .$onUpdate(() => new Date()),
});
export const usersRelations = relations(usersTable, ({ many }) => ({
  jwtTokenBlocklist: many(jwtTokenBlocklist),
  tokens: many(tokens),
  passkeys: many(passkeysTable),
  passkeyChallenges: many(passkeyChallengesTable),
}));
export type InsertUser = typeof usersTable.$inferInsert;
export type SelectUser = typeof usersTable.$inferSelect;

// Define the events table
export const eventsTable = pgTable('events_table', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  date: date('date').notNull(),
  time: time('time').notNull(),
  location: text('location').notNull(),
  description: text('description').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at')
    .notNull()
    .$onUpdate(() => new Date()),
});

// Define types for inserting and selecting data
export type InsertEvent = typeof eventsTable.$inferInsert;
export type SelectEvent = typeof eventsTable.$inferSelect;

/**
 * Passkey Challenges
 */
export const passkeyChallengesTable = pgTable('passkey_challenges_table', {
  id: uuid('id').defaultRandom().primaryKey(),
  challenge: text('challenge').notNull(),
  type: text('type').notNull().$type<PasskeyChallengeType>(),
  challengeUserId: text('challenge_user_id').notNull(),
  userId: integer('user_id')
    .notNull()
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
export type PasskeyChallengeType = 'register' | 'authenticate';
export type InsertPasskeyChallenge = typeof passkeyChallengesTable.$inferInsert;
export type SelectPasskeyChallenge = typeof passkeyChallengesTable.$inferSelect;

/**
 * Passkeys
 */
export const passkeysTable = pgTable('passkeys_table', {
  /** Credential unique ID */
  id: text('id').notNull().primaryKey(),

  /** Public key bytes */
  publicKey: text('public_key').notNull(),

  /** From generateRegistrationOptions() */
  webAuthnUserId: text('webauthn_user_id').notNull(),

  /** How many times used */
  counter: integer('counter').notNull(),

  /** Device type */
  deviceType: text('device_type').notNull().$type<CredentialDeviceType>(),

  /** Whether passkey is single or multi device */
  backedUp: boolean('backed_up').notNull(),

  transports: jsonb('transports')
    .notNull()
    .$type<AuthenticatorTransportFuture[]>(),

  userId: integer('user_id')
    .notNull()
    .references((): AnyPgColumn => usersTable.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at')
    .notNull()
    .$onUpdate(() => new Date()),
});
export const passkeysRelations = relations(passkeysTable, ({ one }) => ({
  user: one(usersTable, {
    fields: [passkeysTable.userId],
    references: [usersTable.id],
  }),
}));
export type InsertPasskey = typeof passkeysTable.$inferInsert;
export type SelectPasskey = typeof passkeysTable.$inferSelect;

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
