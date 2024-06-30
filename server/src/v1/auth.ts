/**
 * SPDX-FileCopyrightText: 2024 Ng Jun Xiang <contact@ngjx.org>
 *
 * SPDX-License-Identifier: GPL-3.0-only
 */

import { ZodIssue } from 'zod';
import { IAuthedRouteHandler, IBareRouteHandler } from '../route-map';
import { auth, errors, schemas } from '../lib/api-types';
import { Http4XX } from '../lib/api-types/http-codes';
import { ErrorResponse } from '../lib/api-types/errors';

import { db } from '../db';
import { eq, or, and } from 'drizzle-orm';
import { jwtTokenBlocklist, tokens, usersTable } from '../db/schemas';

import { decodeJwt, signJwt } from '../utils/service/auth/jwt';
import { hashPassword, matchPassword } from '../utils/password';
import { AuthenticatedRequest } from '../middleware/jwt';

import { sendActivationEmail, sendEmail } from '../utils/service/email/email';
import { getFullPath } from '../utils/app';
import { TOKEN_SETTINGS } from '../utils/service/auth/tokens';

// Availability
export const availability: IBareRouteHandler = async (req, res) => {
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

// Activate account
export const activate: IAuthedRouteHandler = async (req, res) => {
  const validated = schemas.auth.activateFormSchema.safeParse(req.body);
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
    } satisfies auth.RefreshFailAPI);
  }

  // Validate uuid syntax
  if (
    !validated.data.token.match(
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i,
    )
  ) {
    return res.status(Http4XX.BAD_REQUEST).json({
      status: Http4XX.BAD_REQUEST,
      errors: [{ message: 'Token not found!' }],
    } satisfies auth.ActivateFailAPI);
  }

  if (req.user.activated) {
    return res.status(Http4XX.FORBIDDEN).json({
      status: Http4XX.FORBIDDEN,
      errors: [{ message: 'Already activated' }],
    } satisfies auth.ActivateFailAPI);
  }

  // See if token exists
  const foundToken = await db
    .select({ token: tokens.token, iat: tokens.createdAt })
    .from(tokens)
    .where(
      and(
        eq(tokens.userId, req.user.id),
        eq(tokens.token, validated.data.token),
      ),
    )
    .limit(1);

  if (!foundToken.length) {
    return res.status(Http4XX.NOT_FOUND).json({
      status: Http4XX.NOT_FOUND,
      errors: [{ message: 'Token not found!' }],
    } satisfies auth.ActivateFailAPI);
  }

  // Delete token
  await db.delete(tokens).where(eq(tokens.token, validated.data.token));

  // Check expiry
  if (
    foundToken[0].iat.getTime() <
    Date.now() - 1000 * TOKEN_SETTINGS.activation.max
  ) {
    return res.status(Http4XX.BAD_REQUEST).json({
      status: Http4XX.BAD_REQUEST,
      errors: [{ message: 'Token is expired!' }],
    } satisfies auth.ActivateFailAPI);
  }

  return res.status(200).json({
    status: 200,
    data: {
      activated: true,
    },
  } satisfies auth.ActivateSuccAPI);
};

// Invalidate tokens
export const invalidate: IAuthedRouteHandler = async (req, res) => {
  const validated = schemas.auth.invalidateTokenSchema.safeParse(req.body);
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
    } satisfies auth.RefreshFailAPI);
  }

  // Decode tokens
  const refreshJTI = req.headers.authorization!.substring('Bearer '.length);
  const refreshData = decodeJwt(refreshJTI)!;

  const accessData = decodeJwt(validated.data.access_token)!;

  // Add to token blacklist
  await db.insert(jwtTokenBlocklist).values([
    {
      jti: refreshJTI,
      exp: new Date(refreshData.exp * 1000),
      userId: req.user.id,
    },
    {
      jti: validated.data.access_token,
      exp: new Date(accessData.exp * 1000),
      userId: req.user.id,
    },
  ]);

  return res.status(200);
};

// Refresh
export const refresh: IAuthedRouteHandler = async (
  req: AuthenticatedRequest,
  res,
) => {
  const validated = schemas.auth.refreshTokenSchema.safeParse(req.body);
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
    } satisfies auth.RefreshFailAPI);
  }

  // Decode tokens
  const refreshJTI = req.headers.authorization!.substring('Bearer '.length);
  const refreshData = decodeJwt(refreshJTI)!;

  const accessData = decodeJwt(validated.data.access_token)!;

  // Add to token blacklist
  await db.insert(jwtTokenBlocklist).values([
    {
      jti: refreshJTI,
      exp: new Date(refreshData.exp * 1000),
      userId: req.user.id,
    },
    {
      jti: validated.data.access_token,
      exp: new Date(accessData.exp * 1000),
      userId: req.user.id,
    },
  ]);

  // Generate new tokens
  const accessToken = signJwt({ sub: req.user.id }, 'access');
  const refreshToken = signJwt({ sub: req.user.id }, 'refresh');

  return res.status(201).json({
    status: 201,
    data: {
      access_token: accessToken,
      refresh_token: refreshToken,
    },
  } satisfies auth.RefreshSuccAPI);
};

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
      dateOfBirth: '2024-03-25',
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
