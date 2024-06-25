/**
 * SPDX-FileCopyrightText: 2024 Ng Jun Xiang <contact@ngjx.org>
 *
 * SPDX-License-Identifier: GPL-3.0-only
 */

import.meta.env;
import Cookies from 'js-cookie';

const ACCESS_TOKEN_COOKIE_NAME = 'access_token' as const;
const REFRESH_TOKEN_COOKIE_NAME = 'refresh_token' as const;

/** In days */
const ACCESS_TOKEN_MAX_AGE = 1 as const;
const REFRESH_TOKEN_MAX_AGE = 30 as const;

export type TokenType = 'access' | 'refresh';
export const setAuthCookie = (token: string, tokenType: TokenType): void => {
  Cookies.set(
    tokenType === 'access'
      ? ACCESS_TOKEN_COOKIE_NAME
      : REFRESH_TOKEN_COOKIE_NAME,
    token,
    {
      sameSite: 'lax',
      secure: import.meta.env.PROD,
      expires:
        tokenType === 'access' ? ACCESS_TOKEN_MAX_AGE : REFRESH_TOKEN_MAX_AGE,
    },
  );
};

export const unsetAuthCookie = (tokenType: TokenType): void => {
  Cookies.remove(
    tokenType === 'access'
      ? ACCESS_TOKEN_COOKIE_NAME
      : REFRESH_TOKEN_COOKIE_NAME,
  );
};

export const getAuthCookie = (tokenType: TokenType): string | undefined => {
  return Cookies.get(
    tokenType === 'access'
      ? ACCESS_TOKEN_COOKIE_NAME
      : REFRESH_TOKEN_COOKIE_NAME,
  );
};
