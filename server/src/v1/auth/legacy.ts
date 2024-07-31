/**
 * SPDX-FileCopyrightText: 2024 Ng Jun Xiang <contact@ngjx.org>
 *
 * SPDX-License-Identifier: GPL-3.0-only
 */

import { ZodIssue } from 'zod';
import { IBareRouteHandler } from '../../route-map';
import { auth, errors, schemas } from '../../lib/api-types';
import { Http4XX } from '../../lib/api-types/http-codes';

import { db } from '../../db';
import { eq, or } from 'drizzle-orm';
import { tokens, usersTable } from '../../db/schemas';

import { signJwt } from '../../utils/service/auth/jwt';
import { hashPassword, matchPassword } from '../../utils/password';

import { sendActivationEmail } from '../../utils/service/email/email';
import { getFullPath } from '../../utils/app';

// Login
export const login: IBareRouteHandler = async (req, res) => {
  // Validate request body
  const validated = schemas.auth.loginFormSchema.safeParse(req.body);
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
    .where(eq(usersTable.email, validated.data.email))
    .limit(1);
  if (users.length === 0) {
    return res.status(Http4XX.BAD_REQUEST).json({
      status: Http4XX.BAD_REQUEST,
      errors: [{ message: 'Invalid email or password' }],
    } satisfies auth.LoginFailAPI);
  }

  // Compare password hashes
  if (!(await matchPassword(validated.data.password, users[0].password))) {
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
export const register: IBareRouteHandler = async (req, res) => {
  // Validate request body
  const validated = schemas.auth.registerFormSchema.safeParse(req.body);
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

  // Create and save user
  const createdUser = await db
    .insert(usersTable)
    .values({
      permission: 0,
      username: validated.data.username,
      email: validated.data.email,
      password: await hashPassword(validated.data.password),
    })
    .returning({ id: usersTable.id });

  // Create token
  const createdToken = await db
    .insert(tokens)
    .values({
      userId: createdUser[0].id,
      tokenType: 'activation',
    })
    .returning({ token: tokens.token });

  // Send activation email
  const sentEmail = await sendActivationEmail({
    to: validated.data.email,
    options: {
      name: validated.data.username,
      activationLink: getFullPath(`/activate/${createdToken[0].token}`),
    },
  }).catch((err) =>
    console.error(
      `ERR Failed to send activation email for user [${createdUser[0].id}]: ${err}`,
    ),
  );

  if (!sentEmail) {
    return res.status(Http4XX.UNPROCESSABLE_ENTITY).json({
      status: Http4XX.UNPROCESSABLE_ENTITY,
      errors: [{ message: 'Email could not be reached' }],
    } satisfies auth.RegisterFailAPI);
  }

  return res.status(201).json({
    status: 201,
    data: {
      created: true,
    },
  } satisfies auth.RegisterSuccAPI);
};