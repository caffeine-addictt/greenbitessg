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

export type PathStr = `/${string}`;
export type RootPathStr = '*' | '/' | PathStr;
export type PageComponent = (
  props: React.ComponentProps<'div'>,
) => React.JSX.Element;

export type RouteDetails = {
  component: PageComponent;
  title: string;
  description?: string;
};
export type RouteMap = Record<PathStr, RouteDetails>;
export type RootRouteMap = Record<RootPathStr, RouteDetails>;

const routes: RootRouteMap = {
  '*': { component: NotFound, title: 'Page Not Found' },
  '/': { component: RootPage, title: 'Home' },
  ...routeMap,
} as const;
export default routes;
