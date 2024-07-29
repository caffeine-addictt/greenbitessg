/**
 * SPDX-FileCopyrightText: 2024 Ng Jun Xiang <contact@ngjx.org>
 *
 * SPDX-License-Identifier: GPL-3.0-only
 */

import type { RouteMap } from '@pages/route-map';

// Import pages
import Dashboard from './dashboard';

const userRouteMap: RouteMap = {
  '/dashboard': {
    title: 'Dashboard',
    description: 'Check all the relevant details here',
    component: Dashboard,
    accessLevel: 'authenticated',
  },
} as const;
export default userRouteMap;
