/**
 * SPDX-FileCopyrightText: 2024 Ng Jun Xiang <contact@ngjx.org>
 *
 * SPDX-License-Identifier: GPL-3.0-only
 */

import { IAuthedRouteHandler } from '../route-map';
import { GetUserSuccAPI } from '../lib/api-types/user';

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