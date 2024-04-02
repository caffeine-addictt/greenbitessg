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

import express from 'express';
import memCache from 'memory-cache';

import { httpMethods } from '@caffeine-addictt/fullstack-api-types';

// Config
const cacheTime = 10000 as const; // 10seconds

/**
 * Conform to RFC 7231
 * @see {@link https://www.rfc-editor.org/rfc/rfc7231#section-4.3}
 */
export const CachableCode: number[] = [
  200, 203, 204, 206, 300, 301, 404, 405, 410, 414, 501,
] as const;
export const CachableMethod: Array<keyof typeof httpMethods> = [
  'GET',
  'HEAD',
  'OPTIONS',
] as const;
export interface CachedResponse<B> {
  contentType?: string;
  body?: B;
}

// Exports
const iCachingMiddleware = (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
  prefix: string = '__global__',
  time?: number,
  ignoreRFC: boolean = false,
) => {
  const cachableMethod = CachableMethod.includes(
    req.method.toUpperCase() as keyof typeof httpMethods,
  );
  const key = `${prefix}${req.originalUrl || req.url}${req.method}`;

  if (!ignoreRFC || cachableMethod) {
    const rawCached: string = memCache.get(key);

    if (rawCached) {
      const cached: CachedResponse<unknown> = JSON.parse(rawCached);

      if (cached.contentType) res.set('Content-Type', cached.contentType);
      return res.status(302).send(cached.body);
    }
  }

  // @ts-expect-error Alter Response object without having to update other references
  res.sendResponse = res.send;
  res.send = (body) => {
    if (
      !ignoreRFC ||
      (cachableMethod && CachableCode.includes(res.statusCode))
    ) {
      const data: string = JSON.stringify({
        contentType: res.get('Content-Type'),
        body: body,
      } satisfies CachedResponse<typeof body>);
      memCache.put(key, data, time || cacheTime);
    }

    // @ts-expect-error Alter Response object without having to update other references
    return res.sendResponse(body);
  };

  next();
};

export const routeCachingMiddleware =
  (prefix: string, time?: number, ignoreRFC?: boolean) =>
  (req: express.Request, res: express.Response, next: express.NextFunction) =>
    iCachingMiddleware(req, res, next, `__route_${prefix}__`, time, ignoreRFC);

const cachingMiddleware = (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) => iCachingMiddleware(req, res, next, '__global__');
export default cachingMiddleware;
