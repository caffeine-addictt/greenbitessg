/**
 * SPDX-FileCopyrightText: 2024 Ng Jun Xiang <contact@ngjx.org>
 *
 * SPDX-License-Identifier: GPL-3.0-only
 */

import { IAuthedRouteHandler } from '../route-map';

import { type ZodIssue } from 'zod';
import { Http4XX } from '../lib/api-types/http-codes';
import { type errors, schemas } from '../lib/api-types';
import {
  GetUserSuccAPI,
  UpdateUserSuccAPI,
  UpdateUserFailAPI,
  DeleteUserSuccessAPI,
} from '../lib/api-types/user';

import { db } from '../db';
import { usersTable } from '../db/schemas';
import { eq } from 'drizzle-orm';

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
  // Validate request body
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

    // TODO: Create verification token (follow auth register)
    // TODO: Send verification email
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
    data: null,
  } satisfies DeleteUserSuccessAPI);
};
