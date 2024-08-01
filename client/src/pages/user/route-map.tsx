/**
 * SPDX-FileCopyrightText: 2024 Ng Jun Xiang <contact@ngjx.org>
 *
 * SPDX-License-Identifier: GPL-3.0-only
 */

import type { RouteMap } from '@pages/route-map';

// Import pages
import EventCreationPage from './create-events';
import EventList from './event-list';

const userRouteMap: RouteMap = {
  '/events/create': {
    title: 'Create Events',
    accessLevel: 'authenticated',
    description: 'Create Your Events Here',
    component: EventCreationPage 
  },
  '/events': {
    title: 'List Events',
    accessLevel: 'authenticated',
    description: 'List Events Here',
    component: EventList
  },
} as const;
export default userRouteMap;
