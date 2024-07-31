/**
 * SPDX-FileCopyrightText: 2024 Ng Jun Xiang <contact@ngjx.org>
 *
 * SPDX-License-Identifier: GPL-3.0-only
 */

import type { RoutingMap } from '../../route-map';
import deleteFood from './delete';
import getFood from './food';
import { postGenerate } from './generate';

const routeMap: RoutingMap<`/v1/food${string}`> = {
  '/v1/food/generate': {
    GET: { handler: postGenerate },
    accessLevel: 'authenticated',
  },
  '/v1/food/:id': {
    GET: { handler: getFood },
    DELETE: { handler: deleteFood },
    accessLevel: 'authenticated',
  },
  '/v1/food': {
    GET: { handler: getFood },
    accessLevel: 'authenticated',
  },
} as const;
export default routeMap;
