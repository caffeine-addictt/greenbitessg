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

import { RouteHandler } from '../route-map';
import { auth, errors, schemas } from '@caffeine-addictt/fullstack-api-types';
import { HttpErrorCode } from '@caffeine-addictt/fullstack-api-types/src/errors';

// Availability
export const availability: RouteHandler = (_, res) => {
  // TODO: Implement query to DB
  res.status(200).json({
    status: 200,
    data: {
      available: false,
    },
  } satisfies auth.AvailabilityAPI);
};

// Registering
export const register: RouteHandler = async (req, res) => {
  // Validate request body
  const validated = schemas.registerFormSchema.safeParse(req.body);
  if (!validated.success) {
    const errorStack: errors.CustomErrorContext[] = [];
    validated.error.errors.forEach((error) => {
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
