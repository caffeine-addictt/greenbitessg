// Shared API Types
//
// Copyright (C) 2024 Ng Jun Xiang <contact@ngjx.org>
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with this program.  If not, see <http://www.gnu.org/licenses/>.

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
