/**
 * SPDX-FileCopyrightText: 2024 Ng Jun Xiang <contact@ngjx.org>
 *
 * SPDX-License-Identifier: GPL-3.0-only
 */

import type { PageComponent, RouteMap } from '@pages/route-map';

// Import pages
import EmployeeMain from './employee';

const routeMap1: RouteMap = {
  '/employee': {
    title: 'Employee Details',
    description: 'Fill in your details here',
    component: EmployeeMain as PageComponent,
    accessLevel: 'authenticated',
  },
} as const;
export default routeMap1;
