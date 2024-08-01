/**
 * SPDX-FileCopyrightText: 2024 Ng Jun Xiang <contact@ngjx.org>
 *
 * SPDX-License-Identifier: GPL-3.0-only
 */

import express from 'express';
import memCache from 'memory-cache';

import Methods from '../lib/api-types/http-methods';

// Config
const cacheTime = 10000 as const; // 10seconds

/**
 * Conform to RFC 7231
 * @see {@link https://www.rfc-editor.org/rfc/rfc7231#section-4.3}
 */
export const CachableCode: number[] = [
  200, 203, 204, 206, 300, 301, 404, 405, 410, 414, 501,
] as const;
export const CachableMethod: Array<keyof typeof Methods> = [
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
  // Ignore uploadthing
  if (req.url.startsWith('/api/uploadthing')) return next();

  const cachableMethod = CachableMethod.includes(
    req.method.toUpperCase() as keyof typeof Methods,
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

  return next();
};

const cachingMiddleware = (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) => iCachingMiddleware(req, res, next, '__global__');
export default cachingMiddleware;
