// Backend API v1
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

import type {
  RoutingMap as IndexRoutingMap,
  RouteHandlers,
} from '../route-map';
interface RoutingMap extends IndexRoutingMap {
  [path: `/v1/${string}`]: RouteHandlers;
}

// Import endpoints
import { availability } from './auth';

const routeMap: RoutingMap = {
  '/v1/availability': {
    GET: { handler: availability },
  },
} as const;

export default routeMap;
