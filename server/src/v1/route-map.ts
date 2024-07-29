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
} as const;

export default routeMap;
