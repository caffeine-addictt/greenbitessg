/**
 * SPDX-FileCopyrightText: 2024 Ng Jun Xiang <contact@ngjx.org>
 *
 * SPDX-License-Identifier: GPL-3.0-only
 */

import type { RoutingMap } from '../route-map';

// Import endpoints
import authRoutes from './auth/route-map';
import { availability } from './availability';
import { getUser } from './user';
import { getFeedback } from './feedback';

const routeMap: RoutingMap<`/v1/${string}`> = {
  ...authRoutes,
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
  '/v1/feedback': {
    GET: {
      handler: getFeedback,
    },
  },
} as const;

export default routeMap;
