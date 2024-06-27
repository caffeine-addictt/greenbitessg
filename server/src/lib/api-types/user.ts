/**
 * SPDX-FileCopyrightText: 2024 Ng Jun Xiang <contact@ngjx.org>
 *
 * SPDX-License-Identifier: GPL-3.0-only
 */

import * as z from 'zod';

import { user } from './schemas';
import type { SuccessResponse, ErrorResponse } from './index';

/**
 * Successful response for /v1/user endpoint
 */
export interface GetUserSuccAPI
  extends SuccessResponse<z.infer<typeof user.userType>> {}

export interface DeleteUserSuccessAPI extends SuccessResponse<null> {}

/**
 * Successful response for /v1/user/updateUser endpoint
 */
export interface UpdateSuccAPI
  extends SuccessResponse<{ created: boolean }, 201> {}
export type UpdateFailAPI = ErrorResponse<
  | 'Please provide a username!'
  | 'Username needs to be at least 3 characters!'
  | 'Username cannot be longer than 20 characters!'
  | 'Username may only contain alphanumeric characters and (-_)'
  | 'Please provide an email!'
  | 'Email is not valid!'
  | 'Please provide a password!'
  | 'Password needs to be at least 8 characters!'
  | 'Password needs to contain at least 1 lower case character! (a-z)'
  | 'Password needs to contain at least 1 upper case character! (A-Z)'
  | 'Password needs to contain at least 1 digit! (0-9)'
  | 'Password needs to contain at least 1 special character! (!#$%&?\'")'
  | 'Please retype your password!'
  | 'Email could not be reached'
  | 'Username already exists'
  | 'Email already exists'
>;
