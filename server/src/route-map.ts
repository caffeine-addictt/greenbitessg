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
import api from './api/route-map';
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
  authOptions?: {
    /** Compare against `DefaultTokenOption.minDuration` */
    freshTokenOnly?: boolean;

    /** Whether to allow expired token */
    allowExpired?: boolean;

    /** Whether to allow non-activated accounts */
    allowNonActivated?: boolean;
  };
};
export type RouteDetails = { handler: RouteHandler } & AuthenticationOptions;
export type RouteHandlers = {
  [M in httpMethods]?: RouteDetails;
} & { handler?: RouteHandler } & AuthenticationOptions;
export type RoutingMap<T extends string = `/${string}`> = {
  [uri in T]: RouteHandlers;
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
  ...api,
} as const;

export default routeMap;