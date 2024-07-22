/**
 * SPDX-FileCopyrightText: 2024 Ng Jun Xiang <contact@ngjx.org>
 *
 * SPDX-License-Identifier: GPL-3.0-only
 */

import * as z from 'zod';

export const userType = z.object({
  id: z.number().int(),
  permission: z.number().int(),
  username: z.string().min(1),
  email: z.string().email(),
  activated: z.boolean(),
  createdAt: z.date(),
  updatedAt: z.date(),
});
export const accountSettingsSchema = z.object({
  username: z.string().min(1, 'Username is required'),
  email: z.string().email('Invalid email address'),
  permission: z.string().min(1, 'Permission is required'),
});
