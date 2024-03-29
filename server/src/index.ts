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
import express from 'express';
import 'express-async-errors';

import routeMap from './route-map';
import {
  errorHandler,
  notfoundHandler,
  methodNotFoundHandler,
} from './middleware/errors';

const app = express();

// Server Config
app.use(cors({ origin: '*', credentials: true }));
app.use(express.json());

// Register routes
app.use('/static', express.static('public'));
Object.entries(routeMap).forEach(([route, detail]) => {
  Object.entries(detail).forEach(([method, handler]) => {
    switch (method) {
      case 'GET':
        app.get(route, handler);
        break;

      case 'HEAD':
        app.head(route, handler);
        break;

      case 'POST':
        app.post(route, handler);
        break;

      case 'PUT':
        app.put(route, handler);
        break;

      case 'DELETE':
        app.delete(route, handler);
        break;

      case 'CONNECT':
        app.connect(route, handler);
        break;

      case 'OPTIONS':
        app.options(route, handler);
        break;

      case 'TRACE':
        app.trace(route, handler);
        break;

      case 'PATCH':
        app.patch(route, handler);
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
