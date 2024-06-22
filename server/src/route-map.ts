/**
 * SPDX-FileCopyrightText: 2024 Ng Jun Xiang <contact@ngjx.org>
 *
 * SPDX-License-Identifier: GPL-3.0-only
 */

import path from 'path';
import type httpMethods from './lib/api-types/http-methods';
import type { Request, Response, NextFunction } from 'express';

// Importing route handlers
import v1 from './v1/route-map';
import { AuthenticatedRequest } from './middleware/jwt';

// Types
export type RouteAccessLevel = 'authenticated' | 'admin';
export type IBareRouteHandler = (
  req: Request,
  res: Response,
  next: NextFunction,
) => Response | Promise<Response> | void;
export type IAuthedRouteHandler = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => Response | Promise<Response> | void;
export type RouteHandler = IBareRouteHandler | IAuthedRouteHandler;

export type AuthenticationOptions = {
  accessLevel?: RouteAccessLevel;
  tokenType?: 'access' | 'refresh';
};
export type RouteDetails = { handler: RouteHandler } & AuthenticationOptions;
export type RouteHandlers = {
  [M in httpMethods]?: RouteDetails;
} & AuthenticationOptions;
export type RoutingMap = {
  [uri: `/${string}`]: RouteHandlers;
};

// Mapping routes
const routeMap: RoutingMap = {
  '/': {
    GET: {
      handler: (_: Request, res: Response) =>
        res.sendFile(path.join(__dirname, 'index.html')),
    },
  },
  '/api': {
    GET: {
      handler: (_: Request, res: Response) => res.send('This is a test route'),
    },
  },
  ...v1,
} as const;

export default routeMap;
