/**
 * SPDX-FileCopyrightText: 2024 Ng Jun Xiang <contact@ngjx.org>
 *
 * SPDX-License-Identifier: GPL-3.0-only
 */

import type { RouteMap } from '@pages/route-map';

// Import pages
import AccountSettings from './accountsettings';
import Home from './homepage';

const routeMap1: RouteMap = {
  '/accountsettings': {
    title: 'Account Settings',
    description: 'Login to your account',
    component: AccountSettings,
  },
  '/home': {
    title: 'Homepage',
    description: 'This is the homepage',
    component: Home,
  }
} as const;
export default routeMap1;
