/**
 * SPDX-FileCopyrightText: 2024 Ng Jun Xiang <contact@ngjx.org>
 *
 * SPDX-License-Identifier: GPL-3.0-only
 */

import type { IAuthedRouteHandler } from '../route-map';

import type { ZodIssue } from 'zod';
import { Http4XX } from '../lib/api-types/http-codes';
import { type errors, schemas } from '../lib/api-types';
import type {
  GetUserSuccAPI,
  UpdateUserSuccAPI,
  UpdateUserFailAPI,
  DeleteUserSuccAPI,
  GetPasskeySuccAPI,
  DeletePasskeySuccAPI,
  DeletePasskeyFailAPI,
} from '../lib/api-types/user';

import { db } from '../db';
import { eq, and } from 'drizzle-orm';
import { usersTable, passkeysTable, tokens } from '../db/schemas';
import { sendVerificationEmail } from '../utils/service/email/email';
import { getFullPath } from '../utils/app';

export const getUser: IAuthedRouteHandler = async (req, res) => {
  return res.status(200).json({
    status: 200,
    data: {
      id: req.user.id,
      permission: req.user.permission,
      username: req.user.username,
      email: req.user.email,
      activated: req.user.activated,
      createdAt: req.user.createdAt,
      updatedAt: req.user.updatedAt,
    },
  } satisfies GetUserSuccAPI);
};

export const updateUser: IAuthedRouteHandler = async (req, res) => {
  const validated = schemas.user.userUpdateSchema.safeParse(req.body);
  if (!validated.success) {
    const errorStack: errors.CustomErrorContext[] = [];
    validated.error.errors.forEach((error: ZodIssue) => {
      errorStack.push({
        message: error.message,
        context: {
          property: error.path,
          code: error.code,
        },
      });
    });

    return res.status(Http4XX.BAD_REQUEST).json({
      status: Http4XX.BAD_REQUEST,
      errors: errorStack,
    } satisfies UpdateUserFailAPI);
  }
  // Sending verification email
  if (!validated.data.email && !validated.data.username) {
    return res.status(Http4XX.BAD_REQUEST).json({
      status: Http4XX.BAD_REQUEST,
      errors: [{ message: 'Nothing to update!' }],
    } satisfies UpdateUserFailAPI);
  }

  const newUserData: typeof validated.data & { activated?: boolean } = {
    ...validated.data,
  };
  if (validated.data.email) {
    newUserData.activated = false;

    const createdToken = await db
      .insert(tokens)
      .values({
        userId: req.user.id,
        tokenType: 'verification',
      })
      .returning({ token: tokens.token });

    const sendEmail = await sendVerificationEmail({
      to: validated.data.email,
      options: {
        type: 'verification',
        name: validated.data.username || '',
        verificationLink: getFullPath(`/verify/${createdToken[0].token}`),
      },
    }).catch((err) =>
      console.error(
        `ERR Failed to send verification email for user [${req.user.id}]: ${err}`,
      ),
    );

    if (!sendEmail) {
      return res.status(Http4XX.UNPROCESSABLE_ENTITY).json({
        status: Http4XX.UNPROCESSABLE_ENTITY,
        errors: [{ message: 'Email could not be reached' }],
      } satisfies UpdateUserFailAPI);
    }
  }

  await db
    .update(usersTable)
    .set(newUserData)
    .where(eq(usersTable.id, req.user.id));

  return res.status(200).json({
    status: 200,
    data: { updated: true },
  } satisfies UpdateUserSuccAPI);
};

// delete user account
export const deleteUser: IAuthedRouteHandler = async (req, res) => {
  await db.delete(usersTable).where(eq(usersTable.id, req.user.id));

  return res.status(200).json({
    status: 200,
    data: { deleted: true },
  } satisfies DeleteUserSuccAPI);
};

// Get user passkeys
export const getUserPasskeys: IAuthedRouteHandler = async (req, res) => {
  const passkeys: GetPasskeySuccAPI['data'] = await db
    .select({
      id: passkeysTable.id,
      counter: passkeysTable.counter,
      device_type: passkeysTable.deviceType,
      created_at: passkeysTable.createdAt,
      updated_at: passkeysTable.updatedAt,
    })
    .from(passkeysTable)
    .where(eq(passkeysTable.userId, req.user.id));

  return res.status(200).json({
    status: 200,
    data: passkeys,
  } satisfies GetPasskeySuccAPI);
};

// Delete user passket
export const deleteUserPasskey: IAuthedRouteHandler = async (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id) || id < 0) {
    return res.status(400).json({
      status: 400,
      errors: [{ message: 'Passkey not found!' }],
    } satisfies DeletePasskeyFailAPI);
  }

  const found = await db
    .select({})
    .from(passkeysTable)
    .where(and(eq(passkeysTable.userId, req.user.id), eq(passkeysTable.id, id)))
    .limit(1);
  if (found.length === 0) {
    return res.status(400).json({
      status: 400,
      errors: [{ message: 'Passkey not found!' }],
    } satisfies DeletePasskeyFailAPI);
  }

  await db
    .delete(passkeysTable)
    .where(
      and(eq(passkeysTable.userId, req.user.id), eq(passkeysTable.id, id)),
    );

  return res.status(200).json({
    status: 200,
    data: { deleted: true },
  } satisfies DeletePasskeySuccAPI);
};
