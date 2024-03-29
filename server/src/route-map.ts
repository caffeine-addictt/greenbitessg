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
import Methods from './utils/http-methods';
import type { Request, Response, NextFunction } from 'express';

// Importing route handlers

// Types
export type RouteHandler = (
  req: Request,
  res: Response,
  next: NextFunction,
) => Response | void;
export type RouteHandlers = { [M in Methods]?: RouteHandler };
export type RoutingMap = {
  [uri: `/${string}`]: RouteHandlers;
};

// Mapping routes
const routeMap: RoutingMap = {
  '/': { GET: (_, res) => res.sendFile(path.join(__dirname, 'index.html')) },
  '/api': { GET: (_, res) => res.send('This is a test route') },
} as const;

export default routeMap;
