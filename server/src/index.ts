/**
 * SPDX-FileCopyrightText: 2024 Ng Jun Xiang <contact@ngjx.org>
 *
 * SPDX-License-Identifier: GPL-3.0-only
 */

import cors from 'cors';
import morgan from 'morgan';
import express, { RequestHandler } from 'express';
import compression from 'compression';
import 'express-async-errors';
import './check-env';

import routeMap, { IBareRouteHandler, type RouteDetails } from './route-map';
import {
  errorHandler,
  notfoundHandler,
  methodNotFoundHandler,
} from './middleware/errors';
import cachingMiddleware from './middleware/caching';
import rateLimitMiddleware from './middleware/rate-limiting';
import authenticateJWTMiddlewareGenerator from './middleware/jwt';

import { startBackgroundJobs } from './cron';

const app = express();

// Rate Limiting
app.use(rateLimitMiddleware);

// Server Config
app.use(cors({ origin: '*', credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Logging
app.use(morgan('tiny'));

// Caching
app.use(cachingMiddleware);

// Compression
app.use(compression());

// Register routes
app.use('/static', express.static('public'));
Object.entries(routeMap).forEach(([route, methods]) => {
  Object.entries(methods).forEach(([method, detail]) => {
    if (method === 'accessLevel') return;
    const detailCasted = detail as RouteDetails;
    const stack: RequestHandler[] = [detailCasted.handler as IBareRouteHandler];

    // To make only 1 jwt verify middleware
    let authLevel = 0;
    if (
      methods.accessLevel === 'authenticated' ||
      detailCasted.accessLevel === 'authenticated'
    ) {
      authLevel = 1;
    } else if (
      methods.accessLevel === 'admin' ||
      detailCasted.accessLevel === 'admin'
    ) {
      authLevel = 2;
    }

    if (authLevel !== 0) {
      console.log(
        `Adding ${detailCasted.tokenType} JWT middleware for level ${authLevel} route ${route}`,
      );
      stack.push(
        authenticateJWTMiddlewareGenerator(
          detailCasted.tokenType ?? methods.tokenType,
          authLevel === 1 ? 'authenticated' : 'admin',
          detailCasted.authOptions,
        ),
      );
    }

    // Reverse stack
    stack.reverse();

    switch (method) {
      case 'GET':
        app.get(route, ...stack);
        break;

      case 'HEAD':
        app.head(route, ...stack);
        break;

      case 'POST':
        app.post(route, ...stack);
        break;

      case 'PUT':
        app.put(route, ...stack);
        break;

      case 'DELETE':
        app.delete(route, ...stack);
        break;

      case 'CONNECT':
        app.connect(route, ...stack);
        break;

      case 'OPTIONS':
        app.options(route, ...stack);
        break;

      case 'TRACE':
        app.trace(route, ...stack);
        break;

      case 'PATCH':
        app.patch(route, ...stack);
        break;

      default:
        throw new Error('PANIC: Misconfigured methods!');
    }
  });
});

// Handle Errors
app.use(methodNotFoundHandler);
app.use(notfoundHandler);
app.use(errorHandler);

app.listen(3000, () => {
  console.log('Example app listening on port 3000!');
  startBackgroundJobs();
});

export default app;
