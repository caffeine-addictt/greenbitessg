/**
 * SPDX-FileCopyrightText: 2024 Ng Jun Xiang <contact@ngjx.org>
 *
 * SPDX-License-Identifier: GPL-3.0-only
 */

import type { RouteMap } from '@pages/route-map';

// Import pages
import LoginPage from './login';
import RegisterPage from './register';
import ActivateWithTokenPage from './activate';

const routeMap: RouteMap = {
  '/register': {
    title: 'Register',
    description: 'Register a new account with us!',
    component: RegisterPage,
  },
  '/login': {
    title: 'Login',
    description: 'Login to your account',
    component: LoginPage,
  },
  '/activate/:token': {
    title: 'Activate Account',
    description: 'Activate your account',
    component: ActivateWithTokenPage,
    accessLevel: 'authenticated',
  },
} as const;
export default routeMap;
