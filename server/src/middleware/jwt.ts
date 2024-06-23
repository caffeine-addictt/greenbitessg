/**
 * SPDX-FileCopyrightText: 2024 Ng Jun Xiang <contact@ngjx.org>
 *
 * SPDX-License-Identifier: GPL-3.0-only
 */

import express from 'express';

import { verifyJwt } from '../utils/service/auth/jwt';
import { ErrorResponse } from '../lib/api-types';
import { db } from '../db';
import { SelectUser, usersTable } from '../db/schemas';
import { eq } from 'drizzle-orm';

export type AuthenticatedRequest = express.Request & { user: SelectUser };
const authenticateJWTMiddlewareGenerator = (
  tokenType: 'access' | 'refresh' = 'access',
  accessLevel: 'authenticated' | 'admin',
) => {
  return async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({
        status: 401,
        errors: [{ message: 'No token provided!' }],
      } satisfies ErrorResponse);
    }

    const verified = verifyJwt(
      authHeader.substring('Bearer '.length),
      tokenType,
    );
    if (!verified) {
      return res.status(401).json({
        status: 401,
        errors: [{ message: 'Invalid token!' }],
      } satisfies ErrorResponse);
    }

    if (Math.floor(Date.now() / 1000) - verified.exp >= 0) {
      return res.status(401).json({
        status: 401,
        errors: [{ message: 'Token expired!' }],
      } satisfies ErrorResponse);
    }

    // Ensure user exists
    const users = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.id, verified.sub))
      .limit(1);
    if (users.length !== 1) {
      return res.status(401).json({
        status: 401,
        errors: [{ message: 'User does not exist!' }],
      } satisfies ErrorResponse);
    }

    if (accessLevel === 'admin' && users[0].permission !== 0) {
      return res.status(401).json({
        status: 401,
        errors: [{ message: 'Unauthorized!' }],
      } satisfies ErrorResponse);
    }

    (req as AuthenticatedRequest).user = users[0];
    return next();
  };
};
export default authenticateJWTMiddlewareGenerator;
