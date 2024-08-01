/**
 * SPDX-FileCopyrightText: 2024 Ng Jun Xiang <contact@ngjx.org>
 *
 * SPDX-License-Identifier: GPL-3.0-only
 */

import * as z from 'zod';

import { user } from './schemas';
import type { SuccessResponse } from './index';
import { ErrorResponse } from './errors';

/**
 * Successful response for /v1/user endpoint
 */
export interface GetUserSuccAPI
  extends SuccessResponse<z.infer<typeof user.userType>> {}

/**
 * Successful response for /v1/user/update POST endpoint
 */
export interface UpdateUserSuccAPI extends SuccessResponse<{ updated: true }> {}
export type UpdateUserFailAPI = ErrorResponse<'Nothing to update!'>;

/**
 * Successful response for /v1/user/delete POST endpoint
 */
export interface DeleteUserSuccessAPI extends SuccessResponse<null> {}
