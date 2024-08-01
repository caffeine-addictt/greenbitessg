/**
 * SPDX-FileCopyrightText: 2024 Ng Jun Xiang <contact@ngjx.org>
 *
 * SPDX-License-Identifier: GPL-3.0-only
 */

import type { RoutingMap } from '../route-map';

// Import endpoints
import authRoutes from './auth/route-map';
import foodRoutes from './food/route-map';
import { getUser, updateUser, deleteUser } from './user';

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
} as const;

export default routeMap;
