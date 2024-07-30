/**
 * SPDX-FileCopyrightText: 2024 Ng Jun Xiang <contact@ngjx.org>
 *
 * SPDX-License-Identifier: GPL-3.0-only
 */

import { IAuthedRouteHandler } from '../route-map';
import { GetUserSuccAPI, UpdateUserSuccAPI } from '../lib/api-types/user';

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
  const { username, email } = req.body;

  // Validate input
  if (!username || !email) {
    return res.status(400).json({
      status: 400,
      error: 'Username and email are required',
    });
  }

  try {
    // Simulate user update - Replace with actual database logic
    req.user.username = username;
    req.user.email = email;

    // Persist the update to the database if necessary
    // Example: await userRepository.update(req.user.id, { username, email });

    return res.status(200).json({
      status: 200,
      data: {
        id: req.user.id,
        username: req.user.username,
        email: req.user.email,
        permission: req.user.permission,
        activated: req.user.activated,
        createdAt: req.user.createdAt,
        updatedAt: req.user.updatedAt,
      },
    } satisfies UpdateUserSuccAPI);
  } catch (error) {
    console.error('Error updating user:', error);
    return res.status(500).json({
      status: 500,
      error: 'Internal server error',
    });
  }
};
