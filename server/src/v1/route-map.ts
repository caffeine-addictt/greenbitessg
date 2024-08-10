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
import notificationRoutes from './notification/route-map';
import {
  getUser,
  updateUser,
  deleteUser,
  getUserPasskeys,
} from './user';
import { createEvent, deleteEvent, getEvent } from './event';

const routeMap: RoutingMap<`/v1/${string}`> = {
  ...authRoutes,
  ...foodRoutes,
  ...notificationRoutes,
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
  '/v1/user/passkey': {
    GET: { handler: getUserPasskeys },
    accessLevel: 'authenticated',
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
} as const;

export default routeMap;
