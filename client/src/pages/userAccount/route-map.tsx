/**
 * SPDX-FileCopyrightText: 2024 Ng Jun Xiang <contact@ngjx.org>
 *
 * SPDX-License-Identifier: GPL-3.0-only
 */

import type { RouteMap } from '@pages/route-map';

// import pages
import HomePage from './userHomepage';
import SettingPage from './userSettings';

const UserRouteMap: RouteMap = {
  '/home': {
    title: 'Home',
    description: 'Homepage',
    component: HomePage,
    accessLevel: 'authenticated',
  },
  '/settings': {
    title: 'Settings',
    description: 'Settings for account',
    component: SettingPage,
    accessLevel: 'authenticated',
  },
} as const;
export default UserRouteMap;
