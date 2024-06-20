/**
 * SPDX-FileCopyrightText: 2024 Ng Jun Xiang <contact@ngjx.org>
 *
 * SPDX-License-Identifier: GPL-3.0-only
 */

import { ZodIssue } from 'zod';
import { RouteHandler } from '../route-map';
import { auth, errors, schemas } from '../lib/api-types';
import { Http4XX } from '../lib/api-types/http-codes';
import { ErrorResponse } from '../lib/api-types/errors';

import { db } from '../db';
import { eq, or } from 'drizzle-orm';
import { usersTable } from '../db/schemas';

import { signJwt } from '../utils/service/auth/jwt';
import { hashPassword, matchPassword } from '../utils/password';

// Availability
export const availability: RouteHandler = async (req, res) => {
  const username = req.query.username;

  if (typeof username !== 'string') {
    return res.status(Http4XX.BAD_REQUEST).json({
      status: Http4XX.BAD_REQUEST,
      errors: [{ message: 'Missing username' }],
    } satisfies ErrorResponse);
  }

  const user = await db
    .select({})
    .from(usersTable)
    .where(eq(usersTable.username, username))
    .limit(1);

  return res.status(200).json({
    status: 200,
    data: {
      available: user.length === 0,
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

    return res.status(Http4XX.BAD_REQUEST).json({
      status: Http4XX.BAD_REQUEST,
      errors: errorStack,
    } satisfies auth.LoginFailAPI);
  }

  // DB query
  const users = await db
    .select({ id: usersTable.id, password: usersTable.password })
    .from(usersTable)
    .where(eq(usersTable.email, req.body.email))
    .limit(1);
  if (users.length === 0) {
    return res.status(Http4XX.BAD_REQUEST).json({
      status: Http4XX.BAD_REQUEST,
      errors: [{ message: 'Invalid email or password' }],
    } satisfies auth.LoginFailAPI);
  }

  // Compare password hashes
  if (!matchPassword(req.body.password, users[0].password)) {
    return res.status(Http4XX.BAD_REQUEST).json({
      status: Http4XX.BAD_REQUEST,
      errors: [{ message: 'Invalid email or password' }],
    } satisfies auth.LoginFailAPI);
  }

  // Generate JWT access & refresh token
  const accessToken = signJwt({ sub: users[0].id }, 'access');
  const refreshToken = signJwt({ sub: users[0].id }, 'refresh');

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

    return res.status(Http4XX.BAD_REQUEST).json({
      status: Http4XX.BAD_REQUEST,
      errors: errorStack,
    } satisfies auth.RegisterFailAPI);
  }

  // DNS check on email to ensure it is reachable
  const emailReachable = true;
  if (!emailReachable) {
    return res.status(Http4XX.BAD_REQUEST).json({
      status: Http4XX.BAD_REQUEST,
      errors: [{ message: 'Email could not be reached' }],
    } satisfies auth.RegisterFailAPI);
  }

  // Check if username and email is available
  const usersExisting = await db
    .select({ username: usersTable.username, email: usersTable.email })
    .from(usersTable)
    .where(
      or(
        eq(usersTable.username, validated.data.username),
        eq(usersTable.email, validated.data.email),
      ),
    )
    .limit(1);
  if (usersExisting.length !== 0) {
    return res.status(Http4XX.BAD_REQUEST).json({
      status: Http4XX.BAD_REQUEST,
      errors: [
        {
          message:
            usersExisting[0].username === validated.data.username
              ? 'Username already exists'
              : 'Email already exists',
        },
      ],
    } satisfies auth.RegisterFailAPI);
  }

  // TODO: Generate email verification code
  // TODO: Send email verification code
  const emailSent = true;
  if (!emailSent) {
    // TODO: Delete created user object
    return res.status(Http4XX.UNPROCESSABLE_ENTITY).json({
      status: Http4XX.UNPROCESSABLE_ENTITY,
      errors: [{ message: 'Email could not be reached' }],
    } satisfies auth.RegisterFailAPI);
  }

  // Create and save user
  await db
    .insert(usersTable)
    .values({
      username: validated.data.username,
      email: validated.data.email,
      password: await hashPassword(validated.data.password),
    })
    .returning({ id: usersTable.id });

  return res.status(201).json({
    status: 201,
    data: {
      created: true,
    },
  } satisfies auth.RegisterSuccAPI);
};
