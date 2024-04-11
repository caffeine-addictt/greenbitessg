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
import { login, register, availability } from './auth';

const routeMap: RoutingMap = {
  '/v1/auth/login': {
    POST: { handler: login },
  },
  '/v1/auth/register': {
    POST: { handler: register },
  },
  '/v1/availability': {
    GET: { handler: availability },
  },
} as const;

export default routeMap;
