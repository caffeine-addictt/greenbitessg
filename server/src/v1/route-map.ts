/**
 * SPDX-FileCopyrightText: 2024 Ng Jun Xiang <contact@ngjx.org>
 *
 * SPDX-License-Identifier: GPL-3.0-only
 */

import type { RoutingMap } from '../route-map';

// Import endpoints
import authRoutes from './auth/route-map';
import foodRoutes from './food/route-map';
import { createFeedback } from './feedback';
import { getUser, updateUser, deleteUser } from './user';
import { createEvent, deleteEvent, getEvent } from './event';
import { updateDashboard, getDashboard } from './dashboard';

const routeMap: RoutingMap<`/v1/${string}`> = {
  ...authRoutes,
  ...foodRoutes,
  '/v1/user': {
    GET: {
      handler: getUser,
      accessLevel: 'authenticated',
      authOptions: { allowNonActivated: true },
    },
    DELETE: {
      handler: deleteUser,
      accessLevel: 'authenticated',
    },
  },
  '/v1/user/update': {
    POST: {
      handler: updateUser,
      accessLevel: 'authenticated',
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
  '/v1/event/:id': {
    DELETE: {
      handler: deleteEvent,
      accessLevel: 'authenticated',
    },
  },
  '/v1/feedback': {
    POST: {
      handler: createFeedback,
      accessLevel: 'authenticated',
    },
  },
  '/v1/dashboard/update': {
    POST: {
      handler: updateDashboard,
      accessLevel: 'authenticated',
    },
  },
  '/v1/dashboard': {
    GET: {
      handler: getDashboard,
      accessLevel: 'authenticated',
    },
  },
} as const;

export default routeMap;
