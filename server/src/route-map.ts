// Backend API
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

import path from 'path';
import type { httpMethods } from './lib/api-types';
import type { Request, Response, NextFunction } from 'express';

// Importing route handlers
import v1 from './v1/route-map';

// Types
export type RouteHandler = (
  req: Request,
  res: Response,
  next: NextFunction,
) => Response | Promise<Response> | void;

export interface RouteDetailsHandler {
  handler: RouteHandler;
}
export interface RouteDetailsCaching extends RouteDetailsHandler {
  caching?: number;
  prefix: string;
}
export type RouteDetails = RouteDetailsHandler | RouteDetailsCaching;
export type RouteHandlers = { [M in httpMethods]?: RouteDetails };
export type RoutingMap = {
  [uri: `/${string}`]: RouteHandlers;
};

/* eslint-disable-next-line */
export const isBareHandler = (a: any): a is RouteDetailsHandler =>
  !a.caching && !a.prefix;
/* eslint-disable-next-line */
export const isCachingHandler = (a: any): a is RouteDetailsCaching =>
  !!a.prefix;

// Mapping routes
const routeMap: RoutingMap = {
  '/': {
    GET: {
      handler: (_, res) => res.sendFile(path.join(__dirname, 'index.html')),
    },
  },
  '/api': { GET: { handler: (_, res) => res.send('This is a test route') } },
  ...v1,
} as const;

export default routeMap;
