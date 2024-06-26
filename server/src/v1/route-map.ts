/**
 * SPDX-FileCopyrightText: 2024 Ng Jun Xiang <contact@ngjx.org>
 *
 * SPDX-License-Identifier: GPL-3.0-only
 */

import type {
  RoutingMap as IndexRoutingMap,
  RouteHandlers,
} from '../route-map';
interface RoutingMap extends IndexRoutingMap {
  [path: `/v1/${string}`]: RouteHandlers;
}

// Import endpoints
import { login, refresh, register, availability, invalidate } from './auth';
import { getUser } from './user';

const routeMap: RoutingMap = {
  '/v1/auth/login': {
    POST: { handler: login },
  },
  '/v1/auth/refresh': {
    POST: {
      handler: refresh,
      tokenType: 'refresh',
      accessLevel: 'authenticated',
      authOptions: { allowNonActivated: true },
    },
  },
  '/v1/auth/register': {
    POST: { handler: register },
  },
  '/v1/auth/invalidate-tokens': {
    POST: {
      handler: invalidate,
      tokenType: 'refresh',
      accessLevel: 'authenticated',
      authOptions: { allowNonActivated: true },
    },
  },
  '/v1/availability': {
    GET: { handler: availability },
  },
  '/v1/user': {
    GET: {
      handler: getUser,
      accessLevel: 'authenticated',
      authOptions: { allowNonActivated: true },
    },
  },
} as const;

export default routeMap;
