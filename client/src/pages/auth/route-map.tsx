/**
 * SPDX-FileCopyrightText: 2024 Ng Jun Xiang <contact@ngjx.org>
 *
 * SPDX-License-Identifier: GPL-3.0-only
 */

import type { RouteMap } from '@pages/route-map';

// Import pages
import AuthLayout from './auth-layout';
import LogoutPage from './logout';
import RegisterPage from './register';
import LoginOptionsPage from './login-options';
import ActivatePage from './activate';
import { PasskeyLoginPage, PasskeyRegisterPage } from './passkey';

const routeMap: RouteMap = {
  '/register': {
    title: 'Register',
    description: 'Register a new account with us!',
    component: RegisterPage,
  },
  '/login': {
    title: 'Login',
    description: 'Login to your account',
    component: LoginOptionsPage,
  },
  '/logout': {
    title: 'Logout',
    description: 'Logout from your account',
    component: LogoutPage,
  },
  '/auth0/login': {
    title: 'Passkey',
    description: 'Passkey',
    component: PasskeyLoginPage,
    accessLevel: 'public-only',
  },
  '/auth0/register': {
    title: 'Passkey',
    description: 'Passkey',
    component: PasskeyRegisterPage,
    accessLevel: 'authenticated',
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
