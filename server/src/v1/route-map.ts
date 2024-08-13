/**
 * SPDX-FileCopyrightText: 2024 Ng Jun Xiang <contact@ngjx.org>
 *
 * SPDX-License-Identifier: GPL-3.0-only
 */

import type { RoutingMap } from '../route-map';

// Import endpoints
import authRoutes from './auth/route-map';
import foodRoutes from './food/route-map';
import notificationRoutes from './notification/route-map';
import { createFeedback, deleteFeedback, getFeedback } from './feedback';
import {
  getUser,
  updateUser,
  deleteUser,
  getUserPasskeys,
  deleteUserPasskey,
} from './user';
import {
  createEvent,
  deleteEvent,
  getEvent,
  getAnEvent,
  joinEvent,
  getUserJoinedEvent,
  leaveEvent,
} from './event';
import { updateDashboard, getDashboard } from './dashboard';

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
  '/v1/user/passkey/:id': {
    DELETE: { handler: deleteUserPasskey },
    accessLevel: 'authenticated',
  },
  '/v1/user/event': {
    GET: { handler: getUserJoinedEvent },
    accessLevel: 'authenticated',
  },
  '/v1/user/event/:id': {
    POST: { handler: leaveEvent },
    accessLevel: 'authenticated',
  },
  '/v1/event': {
    GET: {
      handler: getEvent,
      authOptions: { allowNonActivated: true },
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
    GET: {
      handler: getAnEvent,
      authOptions: { allowNonActivated: true },
    },
    POST: {
      handler: joinEvent,
      accessLevel: 'authenticated',
    },
  },
  '/v1/feedback': {
    GET: {
      handler: getFeedback,
      accessLevel: 'authenticated',
    },
    POST: {
      handler: createFeedback,
      accessLevel: 'authenticated',
    },
  },
  '/v1/feedback/:id': {
    DELETE: {
      handler: deleteFeedback,
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
