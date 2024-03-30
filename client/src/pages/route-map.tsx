// Top-level route mapping for Frontend App
//
// Copyright (C) 2024 Ng Jun Xiang <contact@ngjx.org>.
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with this program.  If not, see <http://www.gnu.org/licenses/>.

import * as React from 'react';

// Page imports
import NotFound from '@pages/404';
import RootPage from '@pages/root';

export type PathStr = `/${string}`;
export type RootPathStr = '*' | '/' | PathStr;
export type PageComponent = () => React.JSX.Element;

export type RouteDetails = { component: PageComponent; title: string };
export type RouteMap = Record<PathStr, RouteDetails>;
export type RootRouteMap = Record<RootPathStr, RouteDetails>;

const routes: RootRouteMap = {
  '*': { component: NotFound, title: 'Page Not Found' },
  '/': { component: RootPage, title: 'Home' },
};

export default routes;
