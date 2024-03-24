// This is the root-level final page mapping

import * as React from 'react';

// Page imports
import NotFound from '@pages/404';
import RootPage from '@pages/root';

export type PathStr = '*' | '/' | `/${string}`;
export type PageComponent = () => React.JSX.Element;

export type RouteDetails = { component: PageComponent; title: string };
export type RouteMap = Record<PathStr, RouteDetails>;

const routes: RouteMap = {
  '*': { component: NotFound, title: 'Page Not Found' },
  '/': { component: RootPage, title: 'Home' },
};

export default routes;
