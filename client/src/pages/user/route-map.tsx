/**
 * SPDX-FileCopyrightText: 2024 Ng Jun Xiang <contact@ngjx.org>
 *
 * SPDX-License-Identifier: GPL-3.0-only
 */

import type { PageComponent, RouteMap } from '@pages/route-map';

// Import pages
import EventCreationPage from './createevents';
import EventList from './eventlist';

const routeMap1: RouteMap = {
  '/createevents': {
    title: 'Create Events',
    description: 'Create Your Events Here',
    component: EventCreationPage as PageComponent,
  },
  '/eventlist': {
    title: 'List Events',
    description: 'List Events Here',
    component: EventList as PageComponent,
  },
} as const;
export default routeMap1;
