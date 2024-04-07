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

import cors from 'cors';
import morgan from 'morgan';
import express from 'express';
import compression from 'compression';
import 'express-async-errors';

import routeMap from './route-map';
import {
  errorHandler,
  notfoundHandler,
  methodNotFoundHandler,
} from './middleware/errors';
import cachingMiddleware from './middleware/caching';
import rateLimitMiddleware from './middleware/rate-limiting';

const app = express();

// Rate Limiting
app.use(rateLimitMiddleware);

// Server Config
app.use(cors({ origin: '*', credentials: true }));
app.use(express.json());

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
    const stack = [detail!.handler];

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

app.listen(3000, () => console.log('Example app listening on port 3000!'));

export default app;
