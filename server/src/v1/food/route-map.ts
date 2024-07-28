/**
 * SPDX-FileCopyrightText: 2024 Ng Jun Xiang <contact@ngjx.org>
 *
 * SPDX-License-Identifier: GPL-3.0-only
 */

import type { RoutingMap } from '../../route-map';
import { postGenerate } from './generate';

const routeMap: RoutingMap<`/v1/food/${string}`> = {
  '/v1/food/generate': {
    handler: postGenerate,
    accessLevel: 'authenticated',
  },
} as const;
export default routeMap;
