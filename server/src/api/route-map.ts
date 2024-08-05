/**
 * SPDX-FileCopyrightText: 2024 Ng Jun Xiang <contact@ngjx.org>
 *
 * SPDX-License-Identifier: GPL-3.0-only
 */

import type { RoutingMap } from '../route-map';

// Import endpoints
import uploadthing from './uploadthing';
import deleteUploadthing from './delete-uploadthing';

const routeMap: RoutingMap<`/api/${string}`> = {
  '/api/uploadthing': { handler: uploadthing },
  '/api/delete-uploadthing': {
    POST: { handler: deleteUploadthing, accessLevel: 'authenticated' },
  },
} as const;

export default routeMap;
