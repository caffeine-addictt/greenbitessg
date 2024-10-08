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
  smallint,
  integer,
  AnyPgColumn,
  uuid,
  customType,
  boolean,
  jsonb,
  primaryKey,
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
  content: many(contentTable),
  jwtTokenBlocklist: many(jwtTokenBlocklist),
  tokens: many(tokens),
  passkeys: many(passkeysTable),
  passkeyChallenges: many(passkeyChallengesTable),
  feedback: many(feedbackTable),
  notification: many(notificationTable),
}));
export type InsertUser = typeof usersTable.$inferInsert;
export type SelectUser = typeof usersTable.$inferSelect;

/**
 * Feedback
 */
export const feedbackTable = pgTable('feedback_table', {
  id: serial('id').primaryKey(),
  userId: integer('user_id')
    .notNull()
    .references((): AnyPgColumn => usersTable.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  email: text('email').notNull(),
  suggestion: text('suggestion').default(''),
  feedbackMessage: text('message').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at')
    .notNull()
    .$onUpdate(() => new Date()),
});
export const feedbackRelations = relations(feedbackTable, ({ one }) => ({
  user: one(usersTable, {
    fields: [feedbackTable.userId],
    references: [usersTable.id],
  }),
}));
export type InsertFeedback = typeof feedbackTable.$inferInsert;
export type SelectFeedback = typeof feedbackTable.$inferSelect;

/**
 * Dashboard
 */
export const dashboardTable = pgTable('dashboard', {
  id: serial('id').primaryKey(),
  userId: integer('user_id')
    .notNull()
    .references((): AnyPgColumn => usersTable.id, { onDelete: 'cascade' }),
  title: text('title').notNull(),
  description: text('description'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at')
    .notNull()
    .$onUpdate(() => new Date()),
});
export const dashboardRelations = relations(dashboardTable, ({ one }) => ({
  user: one(usersTable, {
    fields: [dashboardTable.userId],
    references: [usersTable.id],
  }),
}));
export type InsertDashboard = typeof dashboardTable.$inferInsert;
export type SelectDashboard = typeof dashboardTable.$inferSelect;

/**
 * Event
 */
export const eventTable = pgTable('events', {
  id: serial('id').primaryKey(),
  userId: integer('user_id')
    .notNull()
    .references((): AnyPgColumn => usersTable.id, { onDelete: 'cascade' }),
  title: text('title').notNull(),
  date: timestamp('date').notNull(),
  time: text('time').notNull(),
  location: text('location').notNull(),
  description: text('description').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at')
    .notNull()
    .$onUpdate(() => new Date()),
});
export const eventRelations = relations(eventTable, ({ one }) => ({
  user: one(usersTable, {
    fields: [eventTable.userId],
    references: [usersTable.id],
  }),
}));
export type InsertEvent = typeof eventTable.$inferInsert;
export type SelectEvent = typeof eventTable.$inferSelect;

/**
 * Table for associating users to events they have joiend
 */
export const usersToEvent = pgTable(
  'users_to_events',
  {
    userId: integer('user_id'),
    eventId: integer('event_id'),
  },
  (usersToEvent) => {
    return {
      pk: primaryKey({ columns: [usersToEvent.userId, usersToEvent.eventId] }),
      pkWithCustomName: primaryKey({
        name: 'users_to_events_pk',
        columns: [usersToEvent.userId, usersToEvent.eventId],
      }),
    };
  },
);
export const UsersToEventRelations = relations(usersToEvent, ({ one }) => ({
  user: one(usersTable, {
    fields: [usersToEvent.userId],
    references: [usersTable.id],
  }),
  event: one(eventTable, {
    fields: [usersToEvent.eventId],
    references: [eventTable.id],
  }),
}));
export type InsertUserToEvent = typeof usersToEvent.$inferInsert;
export type SelectUserToEvent = typeof usersToEvent.$inferSelect;

/**
 * Content
 * Data for uploaded content like images, videos etc.
 *
 * We only store the filename.
 * To access content, add `https://utfs.io/f/` in front of the filename.
 */
export const contentTable = pgTable('content_table', {
  filename: text('filename').primaryKey(),
  size: integer('size').notNull(),
  type: text('type').notNull().$type<'image'>(),
  userId: integer('user_id')
    .notNull()
    .references((): AnyPgColumn => usersTable.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at')
    .notNull()
    .$onUpdate(() => new Date()),
});
export const contentRelations = relations(contentTable, ({ one }) => ({
  user: one(usersTable, {
    fields: [contentTable.userId],
    references: [usersTable.id],
  }),
}));
export type InsertContent = typeof contentTable.$inferInsert;
export type SelectContent = typeof contentTable.$inferSelect;

/**
 * Food table
 *
  food_name: string;
  serving_unit: string;
  tag_name: string;
  serving_qty: number;
  nf_calories: number;
 */
export const foodTable = pgTable('food_table', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  servingUnit: text('serving_unit').notNull(),
  servingQty: integer('serving_qty').notNull(),
  calories: integer('nf_calories').notNull(),
  imageId: text('image_id')
    .notNull()
    .references((): AnyPgColumn => contentTable.filename, {
      onDelete: 'cascade',
    }),
  userId: integer('user_id')
    .notNull()
    .references((): AnyPgColumn => usersTable.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at')
    .notNull()
    .$onUpdate(() => new Date()),
});
export const foodRelations = relations(foodTable, ({ one }) => ({
  user: one(usersTable, {
    fields: [foodTable.userId],
    references: [usersTable.id],
  }),
  image: one(contentTable, {
    fields: [foodTable.imageId],
    references: [contentTable.filename],
  }),
}));
export type InsertFood = typeof foodTable.$inferInsert;
export type SelectFood = typeof foodTable.$inferSelect;

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
  id: serial('id').primaryKey(),

  /** Credential unique ID */
  credentialId: text('credential_id').notNull(),

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

/**
 * Notifications
 */
export const notificationTable = pgTable('notification_table', {
  id: serial('id').primaryKey(),
  userId: integer('user_id')
    .notNull()
    .references(() => usersTable.id, { onDelete: 'cascade' }),
  notificationMessage: text('message').notNull(),
  notificationType: text('type').default('info').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at')
    .notNull()
    .$onUpdate(() => new Date()),
});
export const notificationRelations = relations(
  notificationTable,
  ({ one }) => ({
    user: one(usersTable, {
      fields: [notificationTable.userId],
      references: [usersTable.id],
    }),
  }),
);
export type InsertNotification = typeof notificationTable.$inferInsert;
export type SelectNotification = typeof notificationTable.$inferSelect;
