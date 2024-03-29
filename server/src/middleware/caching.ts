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

import express, { type Response } from 'express';
import memCache from 'memory-cache';

// Config
const cacheTime = 10000 as const; // 10seconds

// Exports
const iCachingMiddleware = (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
  prefix: string = '__global__',
  time?: number,
) => {
  const key = `${prefix}${req.originalUrl || req.url}`;
  const cached = memCache.get(key);

  if (cached) return res.status(302).send(cached);
  // @ts-expect-error Alter Response object without having to update other references
  res.sendResponse = res.send;
  res.send = <A, B, C>(body: A): Response<B, Record<string, C>> => {
    memCache.put(key, body, time || cacheTime);
    // @ts-expect-error Alter Response object without having to update other references
    return res.sendResponse(body);
  };

  next();
};

export const routeCachingMiddleware =
  (time?: number) =>
  (req: express.Request, res: express.Response, next: express.NextFunction) =>
    iCachingMiddleware(req, res, next, '__route__', time);

const cachingMiddleware = (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) => iCachingMiddleware(req, res, next, '__global__');
export default cachingMiddleware;
