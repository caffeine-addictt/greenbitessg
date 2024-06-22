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
 * Successful response for /v1/refresh endpoint
 */
export interface RefreshSuccAPI
  extends SuccessResponse<
    { access_token: string; refresh_token: string },
    201
  > {}
export type RefreshFailAPI = ErrorResponse<
  'Invalid refresh token' | 'Missing token'
>;

/**
 * Response for /v1/login endpoint
 */
export interface LoginSuccAPI
  extends SuccessResponse<{ access_token: string; refresh_token: string }> {}
export type LoginFailAPI = ErrorResponse<
  | 'Email is not valid!'
  | 'Please provide an email!'
  | 'Please provide a password!'
  | 'Invalid email or password'
>;

/**
 * Successful response for /v1/register endpoint
 */
export interface RegisterSuccAPI
  extends SuccessResponse<{ created: boolean }, 201> {}
export type RegisterFailAPI = ErrorResponse<
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
  | 'Please agree to our Terms of Service!'
  | 'Email could not be reached'
  | 'Username already exists'
  | 'Email already exists'
>;
