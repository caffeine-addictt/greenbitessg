/**
 * SPDX-FileCopyrightText: 2024 Ng Jun Xiang <contact@ngjx.org>
 *
 * SPDX-License-Identifier: GPL-3.0-only
 */

import type { SuccessResponse, ErrorResponse } from './index';

/**
 * Successful response for /v1/availability endpoint
 */
export interface AvailabilityAPI
  extends SuccessResponse<{ available: boolean }> {}

/**
 * Successful response for /v1/register endpoint
 */
export interface RegisterSuccAPI
  extends SuccessResponse<{ created: boolean }, 201> {}
export type RegisterFailAPI = ErrorResponse<
  | 'Username already exists'
  | 'Email already exists'
  | 'Email could not be reached'
  | 'Username is not valid'
  | 'Email is not valid'
  | 'Password is not valid'
>;

/**
 * Response for /v1/login endpoint
 */
export interface LoginSuccAPI
  extends SuccessResponse<{ access_token: string; refresh_token: string }> {}
export type LoginFailAPI = ErrorResponse<
  | 'Please provide an email'
  | 'Please provide a password'
  | 'Email is not valid'
  | 'Invalid email or password'
>;
