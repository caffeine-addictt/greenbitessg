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
import { createFeedback, deleteFeedback, getFeedback } from './feedback';

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
} as const;

export default routeMap;
