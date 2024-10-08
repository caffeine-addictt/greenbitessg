/**
 * SPDX-FileCopyrightText: 2024 Ng Jun Xiang <contact@ngjx.org>
 *
 * SPDX-License-Identifier: GPL-3.0-only
 */

import type { RoutingMap } from '../../route-map';

import { login, register } from './legacy';
import {
  loginPasskeyFinish,
  loginPasskeyStart,
  registerPasskeyFinish,
  registerPasskeyStart,
} from './passkey';
import { activate, recreateToken, refresh, invalidate } from './tokens';

const routeMap: RoutingMap<`/v1/auth/${string}`> = {
  '/v1/auth/login': {
    POST: { handler: login },
  },
  '/v1/auth/register': {
    POST: { handler: register },
  },
  '/v1/auth/register/passkeys/start': {
    POST: {
      handler: registerPasskeyStart,
      tokenType: 'access',
      accessLevel: 'authenticated',
    },
  },
  '/v1/auth/register/passkeys/finish': {
    POST: {
      handler: registerPasskeyFinish,
      tokenType: 'access',
      accessLevel: 'authenticated',
    },
  },
  '/v1/auth/login/passkeys/start': {
    POST: {
      handler: loginPasskeyStart,
    },
  },
  '/v1/auth/login/passkeys/finish': {
    POST: {
      handler: loginPasskeyFinish,
    },
  },
  '/v1/auth/activate': {
    POST: {
      handler: activate,
      tokenType: 'access',
      accessLevel: 'authenticated',
      authOptions: { allowNonActivated: true },
    },
  },
  '/v1/auth/recreate-token': {
    POST: {
      handler: recreateToken,
      accessLevel: 'authenticated',
      authOptions: { allowNonActivated: true },
    },
  },
  '/v1/auth/refresh': {
    POST: {
      handler: refresh,
      tokenType: 'refresh',
      accessLevel: 'authenticated',
      authOptions: { allowNonActivated: true },
    },
  },
  '/v1/auth/invalidate-tokens': {
    POST: {
      handler: invalidate,
      tokenType: 'refresh',
      accessLevel: 'authenticated',
      authOptions: { allowNonActivated: true },
    },
  },
} as const;

export default routeMap;
