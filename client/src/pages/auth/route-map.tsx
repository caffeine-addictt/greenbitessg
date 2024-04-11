/**
 * SPDX-FileCopyrightText: 2024 Ng Jun Xiang <contact@ngjx.org>
 *
 * SPDX-License-Identifier: GPL-3.0-only
 */

import type { RouteMap } from '@pages/route-map';

// Import pages
import LoginPage from './login';
import RegisterPage from './register';

const routeMap: RouteMap = {
  '/register': { title: 'Register', component: RegisterPage },
  '/login': { title: 'Login', component: LoginPage },
} as const;
export default routeMap;
