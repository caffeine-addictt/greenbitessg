/**
 * SPDX-FileCopyrightText: 2024 Ng Jun Xiang <contact@ngjx.org>
 *
 * SPDX-License-Identifier: GPL-3.0-only
 */

import type { RouteMap } from '@pages/route-map';

// Import pages
import AuthLayout from './authLayout';
import RegisterPage from './register';
import ActivatePage from './activate';

const routeMap: RouteMap = {
  '/register': {
    title: 'Register',
    description: 'Register a new account with us!',
    component: RegisterPage,
  },
  '/login': {
    title: 'Login',
    description: 'Login to your account',
    component: AuthLayout,
  },
  '/activate': {
    title: 'Activate Account',
    description: 'Activate your account',
    component: ActivatePage,
    accessLevel: 'authenticated',
  },
  '/activate/:token': {
    title: 'Activate Account',
    description: 'Activate your account',
    component: ActivatePage,
    accessLevel: 'authenticated',
  },
} as const;
export default routeMap;
