/**
 * SPDX-FileCopyrightText: 2024 Ng Jun Xiang <contact@ngjx.org>
 *
 * SPDX-License-Identifier: GPL-3.0-only
 */

import type { RoutingMap } from '../route-map';

// Import endpoints
import uploadthing from './uploadthing';

const routeMap: RoutingMap<`/api/${string}`> = {
  '/api/uploadthing': { handler: uploadthing },
} as const;

export default routeMap;
