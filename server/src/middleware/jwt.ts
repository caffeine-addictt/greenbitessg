/**
 * SPDX-FileCopyrightText: 2024 Ng Jun Xiang <contact@ngjx.org>
 *
 * SPDX-License-Identifier: GPL-3.0-only
 */

import express from 'express';
import { and, eq } from 'drizzle-orm';

import { db } from '../db';
import {
  jwtTokenBlocklist,
  SelectUser,
  tokens,
  usersTable,
} from '../db/schemas';

import { ErrorResponse } from '../lib/api-types';
import { DEFAULT_TOKEN_OPTIONS, verifyJwt } from '../utils/service/auth/jwt';
import type { AuthenticationOptions } from '../route-map';

// Internal
export const iAuthenticate = async (
  tokenType: AuthenticationOptions['tokenType'] = 'access',
  accessLevel: AuthenticationOptions['accessLevel'],
  authOptions: AuthenticationOptions['authOptions'],
  req: express.Request,
) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    throw new Error('No token provided!');
  }

  const token = authHeader.substring('Bearer '.length);
  const verified = verifyJwt(token, tokenType);

  if (!verified) {
    throw new Error('Invalid token!');
  }

  // Check blacklist
  const blocked = await db
    .select({})
    .from(jwtTokenBlocklist)
    .where(eq(jwtTokenBlocklist.jti, token))
    .limit(1);
  if (blocked.length > 0) throw new Error('Invalid token!');

  // Check expiry
  if (
    (authOptions?.allowExpired === undefined || !authOptions?.allowExpired) &&
    Math.floor(Date.now() / 1000) - verified.exp >= 0
  ) {
    throw new Error('Token expired!');
  }

  // Check freshness
  if (
    authOptions?.freshTokenOnly &&
    Math.floor(Date.now() / 1000) - verified.iat >
      DEFAULT_TOKEN_OPTIONS[tokenType].minDuration
  ) {
    throw new Error('Token no longer fresh!');
  }

  // Ensure user exists
  const queried = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.id, verified.sub))
    .leftJoin(
      tokens,
      and(eq(tokens.userId, usersTable.id), eq(tokens.tokenType, 'activation')),
    )
    .limit(1);
  if (queried.length !== 1) {
    throw new Error('User does not exist!');
  }

  if (accessLevel === 'admin' && queried[0].users_table.permission !== 0) {
    throw new Error('Unauthorized!');
  }

  const isActivated = !queried[0].tokens;
  if (
    accessLevel === 'authenticated' &&
    !authOptions?.allowNonActivated &&
    !isActivated
  ) {
    throw new Error('Account not activated!');
  }

  (req as AuthenticatedRequest).user = {
    ...queried[0].users_table,
    activated: isActivated,
  };
};

// Export
export type AuthenticatedRequest = express.Request & {
  user: SelectUser & { activated: boolean };
};
const authenticateJWTMiddlewareGenerator = (
  tokenType: AuthenticationOptions['tokenType'] = 'access',
  accessLevel: AuthenticationOptions['accessLevel'],
  authOptions: AuthenticationOptions['authOptions'],
) => {
  return async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ) => {
    const authed = await iAuthenticate(
      tokenType,
      accessLevel,
      authOptions,
      req,
    ).catch((err: Error) => err.message);
    if (authed) {
      return res.status(401).json({
        status: 401,
        errors: [{ message: authed }],
      } satisfies ErrorResponse);
    }

    return next();
  };
};
export default authenticateJWTMiddlewareGenerator;
