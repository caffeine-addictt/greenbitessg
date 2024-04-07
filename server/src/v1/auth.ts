// Backend API v1
//
// Copyright (C) 2024 Ng Jun Xiang <contact@ngjx.org>.
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

import { ZodIssue } from 'zod';
import { RouteHandler } from '../route-map';
import { auth, errors, schemas } from '../lib/api-types';
import { HttpErrorCode } from '../lib/api-types/errors';

// Availability
export const availability: RouteHandler = (_, res) => {
  // TODO: Implement query to DB
  return res.status(200).json({
    status: 200,
    data: {
      available: false,
    },
  } satisfies auth.AvailabilityAPI);
};

// Login
export const login: RouteHandler = async (req, res) => {
  // Validate request body
  const validated = schemas.loginFormSchema.safeParse(req.body);
  if (!validated.success) {
    const errorStack: errors.CustomErrorContext[] = [];
    validated.error.errors.forEach((error: ZodIssue) => {
      errorStack.push({
        message: error.message,
        context: {
          property: error.path,
          code: error.code,
        },
      });
    });

    return res.status(HttpErrorCode.BAD_REQUEST).json({
      status: HttpErrorCode.BAD_REQUEST,
      errors: errorStack,
    } satisfies auth.LoginFailAPI);
  }

  // TODO: Implement query to DB (email)
  const user = true;
  if (!user) {
    return res.status(errors.HttpErrorCode.BAD_REQUEST).json({
      status: errors.HttpErrorCode.BAD_REQUEST,
      errors: [{ message: 'Invalid email or password' }],
    } satisfies auth.LoginFailAPI);
  }

  // TODO: Hash password

  // TODO: Compare password hashes
  const passwordsMatch = true;
  if (!passwordsMatch) {
    return res.status(errors.HttpErrorCode.BAD_REQUEST).json({
      status: errors.HttpErrorCode.BAD_REQUEST,
      errors: [{ message: 'Invalid email or password' }],
    } satisfies auth.LoginFailAPI);
  }

  // TODO: Generate JWT access & refresh token
  const accessToken = 'access token';
  const refreshToken = 'refresh token';

  return res.status(200).json({
    status: 200,
    data: {
      access_token: accessToken,
      refresh_token: refreshToken,
    },
  } satisfies auth.LoginSuccAPI);
};

// Registering
export const register: RouteHandler = async (req, res) => {
  // Validate request body
  const validated = schemas.registerFormSchema.safeParse(req.body);
  if (!validated.success) {
    const errorStack: errors.CustomErrorContext[] = [];
    validated.error.errors.forEach((error: ZodIssue) => {
      errorStack.push({
        message: error.message,
        context: {
          property: error.path,
          code: error.code,
        },
      });
    });

    return res.status(HttpErrorCode.BAD_REQUEST).json({
      status: HttpErrorCode.BAD_REQUEST,
      errors: errorStack,
    } satisfies auth.RegisterFailAPI);
  }

  // TODO: Implement query to DB to check if username is available
  const usernameAvailable = true;
  if (!usernameAvailable) {
    return res.status(HttpErrorCode.BAD_REQUEST).json({
      status: HttpErrorCode.BAD_REQUEST,
      errors: [{ message: 'Username already exists' }],
    } satisfies auth.RegisterFailAPI);
  }

  // TODO: DNS check on email to ensure it is reachable
  const emailReachable = true;
  if (!emailReachable) {
    return res.status(HttpErrorCode.BAD_REQUEST).json({
      status: HttpErrorCode.BAD_REQUEST,
      errors: [{ message: 'Email could not be reached' }],
    } satisfies auth.RegisterFailAPI);
  }

  // TODO: Implement query to DB to check if email is available
  const emailAvailable = true;
  if (!emailAvailable) {
    return res.status(HttpErrorCode.FORBIDDEN).json({
      status: HttpErrorCode.FORBIDDEN,
      errors: [{ message: 'Email already exists' }],
    } satisfies auth.RegisterFailAPI);
  }

  // TODO: Hash password

  // TODO: Create user object (without saving)

  // TODO: Generate email verification code

  // TODO: Send email verification code
  const emailSent = true;
  if (!emailSent) {
    // TODO: Delete created user object
    return res.status(HttpErrorCode.UNPROCESSABLE_ENTITY).json({
      status: HttpErrorCode.UNPROCESSABLE_ENTITY,
      errors: [{ message: 'Email could not be reached' }],
    } satisfies auth.RegisterFailAPI);
  }

  // TODO: Save user object

  return res.status(201).json({
    status: 201,
    data: {
      created: true,
    },
  } satisfies auth.RegisterSuccAPI);
};
