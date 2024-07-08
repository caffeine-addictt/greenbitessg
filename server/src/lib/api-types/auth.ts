/**
 * SPDX-FileCopyrightText: 2024 Ng Jun Xiang <contact@ngjx.org>
 *
 * SPDX-License-Identifier: GPL-3.0-only
 */

import type { SuccessResponse, ErrorResponse } from './index';
import {
  generateAuthenticationOptions,
  generateRegistrationOptions,
} from '@simplewebauthn/server';

/**
 * Successful response for /v1/availability endpoint
 */
export interface AvailabilityAPI
  extends SuccessResponse<{ available: boolean }> {}

/**
 * Successful response for /v1/auth/activate endpoint
 */
export interface ActivateSuccAPI extends SuccessResponse<{ activated: true }> {}
export type ActivateFailAPI = ErrorResponse<
  | 'Already activated!'
  | 'Token not found!'
  | 'Please provide a token!'
  | 'Token is expired!'
>;

/**
 * Successful response for /v1/auth/login/passkeys endpoint
 */
export interface LoginPasskeysStartSuccAPI
  extends SuccessResponse<
    {
      track: string;
      challenge: Awaited<ReturnType<typeof generateAuthenticationOptions>>;
    },
    201
  > {}
export type LoginPasskeysStartFailAPI = ErrorResponse<
  'Please provide an email!' | 'Email is not valid!' | 'Account does not exist!'
>;

/**
 * Successful response for /v1/auth/login/passkeys/finish endpoint
 */
export interface LoginPasskeysFinishSuccAPI
  extends SuccessResponse<
    { access_token: string; refresh_token: string },
    201
  > {}
export type LoginPasskeysFinishFailAPI = ErrorResponse<
  'No passkey challenges found' | 'Failed to authenticate passkey'
>;

/**
 * Successful response for /v1/auth/register/passkeys/start endpoint
 */
export interface RegisterPasskeysStartSuccAPI
  extends SuccessResponse<
    {
      track: string;
      challenge: Awaited<ReturnType<typeof generateRegistrationOptions>>;
    },
    201
  > {}

/**
 * Successful response for /v1/auth/register/passkeys/finish endpoint
 */
export interface RegisterPasskeysFinishSuccAPI
  extends SuccessResponse<{ created: true }, 201> {}
export type RegisterPasskeysFinishFailAPI = ErrorResponse<
  'No passkey challenges found' | 'Failed to register passkey'
>;

/**
 * Successful response for /v1/auth/recreate-token endpoint
 */
export interface RecreateTokenSuccAPI
  extends SuccessResponse<{ created: true }, 201> {}
export type RecreateTokenFailAPI = ErrorResponse<
  | 'Recreating token too quickly!'
  | 'No such token to recreate!'
  | 'Invalid token type!'
  | 'Email could not be reached!'
>;

/**
 * Successful response for /v1/auth/refresh endpoint
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
 * Response for /v1/auth/login endpoint
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
 * Successful response for /v1/auth/register endpoint
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
