/**
 * SPDX-FileCopyrightText: 2024 Ng Jun Xiang <contact@ngjx.org>
 *
 * SPDX-License-Identifier: GPL-3.0-only
 */

import type { PageComponent, RouteMap } from '@pages/route-map';

// Import pages
import EventCreationPage from './create-events';
import EventList from './event-list';

const routeMaps: RouteMap = {
  '/createevents': {
    title: 'Create Events',
    description: 'Create Your Events Here',
    component: EventCreationPage as PageComponent,
  },
  '/event': {
    title: 'List Events',
    description: 'List Events Here',
    component: EventList as PageComponent,
  },
} as const;
export default routeMaps;
