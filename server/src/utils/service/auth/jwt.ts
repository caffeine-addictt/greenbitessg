/**
 * SPDX-FileCopyrightText: 2024 Ng Jun Xiang <contact@ngjx.org>
 *
 * SPDX-License-Identifier: GPL-3.0-only
 */

import jwt, { SignOptions } from 'jsonwebtoken';

export type JwtPayload = {
  /** User id */
  sub: number;

  /** Issued at */
  iat: number;

  /** Expiration */
  exp: number;
};

export type DefaultTokenOption = {
  /** Is what is assigned to exp in seconds */
  maxDuration: number;

  /** Min duration in seconds */
  minDuration: number;

  /** Options to override passed ones */
  options: SignOptions;
};
export const DEFAULT_TOKEN_OPTIONS = {
  access: {
    maxDuration: 60 * 60 * 24, // 1 day
    minDuration: 60 * 5, // 5 minutes
    options: {
      algorithm: 'HS256',
    },
  } satisfies DefaultTokenOption,
  refresh: {
    maxDuration: 60 * 60 * 24 * 30, // 30 days
    minDuration: 60 * 60 * 24, // 1 day
    options: {
      algorithm: 'HS256',
    },
  } satisfies DefaultTokenOption,
} as const;

/** @returns Signed JWT */
export const signJwt = (
  payload: Omit<JwtPayload, 'iat' | 'exp'>,
  key: 'access' | 'refresh',
  options?: SignOptions,
): string =>
  jwt.sign(
    {
      ...payload,
      iat: Math.floor(Date.now() / 1000),
      exp:
        Math.floor(Date.now() / 1000) + DEFAULT_TOKEN_OPTIONS[key].maxDuration,
    },
    key === 'access'
      ? process.env.JWT_ACCESS_KEY!
      : process.env.JWT_REFRESH_KEY!,
    {
      ...(options && options),
      ...DEFAULT_TOKEN_OPTIONS[key].options,
    },
  );

/** @returns Payload or null if failed to verify */
export const verifyJwt = (
  token: string,
  key: 'access' | 'refresh',
): JwtPayload | null => {
  try {
    const payload = jwt.verify(
      token,
      key === 'access'
        ? process.env.JWT_ACCESS_KEY!
        : process.env.JWT_REFRESH_KEY!,
    );
    if (typeof payload === 'string') throw new Error(`Invalid JWT: ${payload}`);
    return payload as unknown as JwtPayload;
  } catch (error) {
    console.log(`Failed to verify JWT: ${error}`);
    return null;
  }
};
