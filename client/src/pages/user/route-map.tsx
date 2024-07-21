/**
 * SPDX-FileCopyrightText: 2024 Ng Jun Xiang <contact@ngjx.org>
 *
 * SPDX-License-Identifier: GPL-3.0-only
 */

import type { RouteMap } from '@pages/route-map';

// Import pages
import AccountSettings from './accountsettings';

const routeMap: RouteMap = {
  '/accountsettings': {
    title: 'Account Settings',
    description: 'Login to your account',
    component: AccountSettings,
  },
} as const;
export default routeMap;
