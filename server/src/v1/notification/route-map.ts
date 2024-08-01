/**
 * SPDX-FileCopyrightText: 2024 Ng Jun Xiang <contact@ngjx.org>
 *
 * SPDX-License-Identifier: GPL-3.0-only
 */

import type { RoutingMap } from '../../route-map';
import getNotification from './notification';
import archiveNotification from './delete';

const routeMap: RoutingMap<`/v1/notification${string}`> = {
  '/v1/notification': {
    GET: {
      handler: getNotification,
      accessLevel: 'authenticated',
      authOptions: { allowNonActivated: false },
    },
  },
  '/v1/notification/archive': {
    POST: {
      handler: archiveNotification,
      accessLevel: 'authenticated',
      authOptions: { allowNonActivated: false },
    },
  },
} as const;
export default routeMap;
