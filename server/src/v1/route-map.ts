/**
 * SPDX-FileCopyrightText: 2024 Ng Jun Xiang <contact@ngjx.org>
 *
 * SPDX-License-Identifier: GPL-3.0-only
 */

import type { RoutingMap } from '../route-map';

// Import endpoints
import authRoutes from './auth/route-map';
import foodRoutes from './food/route-map';
import { getUser } from './user';
import deleteEvent, { getEvent } from './event';
import { createEvent } from './event';

const routeMap: RoutingMap<`/v1/${string}`> = {
  ...authRoutes,
  ...foodRoutes,
  '/v1/user': {
    GET: {
      handler: getUser,
      accessLevel: 'authenticated',
      authOptions: { allowNonActivated: true },
    },
  },
  '/v1/event': {
    GET: {
      handler: getEvent,
      accessLevel: 'authenticated',
    },
    POST: {
      handler: createEvent,
      accessLevel: 'authenticated',
    },
  },
  '/v1/event/delete/:id': {
    DELETE: {
      handler: deleteEvent,
      accessLevel: 'authenticated',
    },
  },
} as const;

export default routeMap;
