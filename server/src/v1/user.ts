/**
 * SPDX-FileCopyrightText: 2024 Ng Jun Xiang <contact@ngjx.org>
 *
 * SPDX-License-Identifier: GPL-3.0-only
 */

import { IAuthedRouteHandler } from '../route-map';
import { GetUserSuccAPI, DeleteUserSuccessAPI } from '../lib/api-types/user';
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
      createdAt: req.user.createdAt,
      updatedAt: req.user.updatedAt,
    },
  } satisfies GetUserSuccAPI);
};

// delete user account
export const deleteUser: IAuthedRouteHandler = async (req, res) => {
  await db.delete(usersTable).where(eq(usersTable.id, req.user.id));

  return res.status(200).json({
    status: 200,
    data: null,
  } satisfies DeleteUserSuccessAPI);
};
