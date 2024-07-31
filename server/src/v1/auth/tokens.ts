/**
 * SPDX-FileCopyrightText: 2024 Ng Jun Xiang <contact@ngjx.org>
 *
 * SPDX-License-Identifier: GPL-3.0-only
 */

import { ZodIssue } from 'zod';
import { IAuthedRouteHandler } from '../../route-map';
import { auth, errors, schemas } from '../../lib/api-types';
import { Http4XX } from '../../lib/api-types/http-codes';

import { db } from '../../db';
import { eq, and } from 'drizzle-orm';
import { jwtTokenBlocklist, tokens, TokenType } from '../../db/schemas';

import { decodeJwt, signJwt } from '../../utils/service/auth/jwt';
import { AuthenticatedRequest } from '../../middleware/jwt';

import {
  sendActivationEmail,
  sendEmail,
} from '../../utils/service/email/email';
import { getFullPath } from '../../utils/app';
import { TOKEN_SETTINGS } from '../../utils/service/auth/tokens';

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

// Recreate token
export const recreateToken: IAuthedRouteHandler = async (req, res) => {
  const validated = schemas.auth.recreateTokenSchema.safeParse(req.body);
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

  if (!['activation', 'verification'].includes(validated.data.token_type)) {
    return res.status(400).json({
      status: 400,
      errors: [{ message: 'Invalid token type!' }],
    } satisfies auth.RecreateTokenFailAPI);
  }

  const tokensFound = await db
    .select({ token: tokens.token, iat: tokens.createdAt })
    .from(tokens)
    .where(
      and(
        eq(tokens.userId, req.user.id),
        eq(tokens.tokenType, validated.data.token_type as TokenType),
      ),
    )
    .limit(1);

  if (!tokensFound.length) {
    return res.status(Http4XX.NOT_FOUND).json({
      status: Http4XX.NOT_FOUND,
      errors: [{ message: 'No such token to recreate!' }],
    } satisfies auth.RecreateTokenFailAPI);
  }

  if (
    Date.now() - tokensFound[0].iat.getTime() <
    1000 * TOKEN_SETTINGS[validated.data.token_type as TokenType].min
  ) {
    return res.status(Http4XX.BAD_REQUEST).json({
      status: Http4XX.BAD_REQUEST,
      errors: [{ message: 'Recreating token too quickly!' }],
    } satisfies auth.RecreateTokenFailAPI);
  }

  // Recreate
  await db.delete(tokens).where(eq(tokens.token, tokensFound[0].token));
  const createdToken = await db
    .insert(tokens)
    .values({
      tokenType: validated.data.token_type as TokenType,
      userId: req.user.id,
    })
    .returning({ token: tokens.token });

  // Send email
  let sentEmail: ReturnType<typeof sendEmail>;
  switch (validated.data.token_type) {
    case 'activation':
      sentEmail = sendActivationEmail({
        to: req.user.email,
        options: {
          name: req.user.username,
          activationLink: getFullPath(`/activate/${createdToken[0].token}`),
        },
      });
      break;

    default:
      throw '';
  }

  const resp = await sentEmail.catch((err) =>
    console.error(
      `ERR Failed to send activation email for user [${req.user.id}]: ${err}`,
    ),
  );

  if (!resp) {
    return res.status(Http4XX.UNPROCESSABLE_ENTITY).json({
      status: Http4XX.UNPROCESSABLE_ENTITY,
      errors: [{ message: 'Email could not be reached' }],
    } satisfies auth.RecreateTokenFailAPI);
  }

  return res.status(201).json({
    status: 201,
    data: {
      created: true,
    },
  } satisfies auth.RecreateTokenSuccAPI);
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