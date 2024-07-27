/**
 * SPDX-FileCopyrightText: 2024 Ng Jun Xiang <contact@ngjx.org>
 *
 * SPDX-License-Identifier: GPL-3.0-only
 */

import * as React from 'react';

// Page imports
import NotFound from '@pages/404';
import RootPage from '@pages/root';
import routeMap from '@pages/auth/route-map';
import routeMaps from './user/route-map';

export type PathStr = `/${string}`;
export type RootPathStr = '*' | '/' | PathStr;
export type PageComponent = (
  props: React.ComponentProps<'div'>,
) => React.JSX.Element;

export type RouteDetails = {
  component: PageComponent;
  title: string;
  description?: string;
  accessLevel?: 'public' | 'public-only' | 'authenticated' | 'admin';
};
export type RouteMap = Record<PathStr, RouteDetails>;
export type RootRouteMap = Record<RootPathStr, RouteDetails>;

const routes: RootRouteMap = {
  '*': { component: NotFound, title: 'Page Not Found' },
  '/': { component: RootPage, title: 'Home' },
  '/home': {
    component: () => <>Home</>,
    accessLevel: 'authenticated',
    title: 'Home',
  },
  '/admin': {
    component: () => <>Admin</>,
    accessLevel: 'admin',
    title: 'Admin',
  },
  ...routeMap,
  ...routeMaps,
} as const;
export default routes;
