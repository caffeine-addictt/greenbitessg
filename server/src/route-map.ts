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

// Types
export type RouteHandler = (
  req: Request,
  res: Response,
  next: NextFunction,
) => Response | Promise<Response> | void;

export type RouteDetails = { handler: RouteHandler };
export type RouteHandlers = { [M in httpMethods]?: RouteDetails };
export type RoutingMap = {
  [uri: `/${string}`]: RouteHandlers;
};

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
