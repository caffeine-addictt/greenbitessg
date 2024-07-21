/**
 * SPDX-FileCopyrightText: 2024 Ng Jun Xiang <contact@ngjx.org>
 *
 * SPDX-License-Identifier: GPL-3.0-only
 */

import type { RouteMap } from '@pages/route-map';

// Import pages
import LoginOptionsPage from './login-options';
import RegisterOptionsPage from './register-options';

import LogoutPage from './logout';
import LoginPage from './legacy-login';
import RegisterPage from './legacy-register';

import ActivatePage from './activate';
import { PasskeyLoginPage, PasskeyRegisterPage } from './passkey';

const routeMap: RouteMap = {
  '/register': {
    title: 'Register',
    description: 'Register a new account with us!',
    component: RegisterOptionsPage,
    accessLevel: 'public-only',
  },
  '/login': {
    title: 'Login',
    description: 'Login to your account',
    component: LoginOptionsPage,
    accessLevel: 'public-only',
  },
  '/auth/login': {
    title: 'Login',
    description: 'Login to your account with email and password',
    component: LoginPage,
    accessLevel: 'public-only',
  },
  '/auth/register': {
    title: 'Register',
    description: 'Register a new account with us!',
    component: RegisterPage,
    accessLevel: 'public-only',
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
