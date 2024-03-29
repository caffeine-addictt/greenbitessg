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
import type { Request, Response, NextFunction } from 'express';

// Importing route handlers

/**
 * HTTP Methods.
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods}
 */
enum Methods {
  /**
   * HTTP GET request.
   * This method should only have data in the URL as query parameters.
   */
  GET = 'GET',

  /**
   * HTTP HEAD request.
   * This method should only return headers and automatically calls the HTTP GET for the same route.
   */
  HEAD = 'HEAD',

  /**
   * HTTP POST request.
   * This method can have data in the URL as query parameters and request body as JSON.
   */
  POST = 'POST',

  /**
   * HTTP PUT request.
   * This method replaces all current representations of the target resource with the request payload.
   */
  PUT = 'PUT',

  /**
   * HTTP DELETE request.
   * This method deletes the specified resource.
   */
  DELETE = 'DELETE',

  /**
   * HTTP CONNECT request.
   * This method establishes a tunnel to the server identified by the target resource.
   */
  CONNECT = 'CONNECT',

  /**
   * HTTP OPTIONS request.
   * This method describes the communication options for the target resource.
   */
  OPTIONS = 'OPTIONS',

  /**
   * HTTP TRACE request.
   * This method performs a message loop-back test along the path to the target resource.
   */
  TRACE = 'TRACE',

  /**
   * HTTP PATCH request.
   * This method applies partial modifications to a resource.
   */
  PATCH = 'PATCH',
}

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
