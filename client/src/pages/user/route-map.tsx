/**
 * SPDX-FileCopyrightText: 2024 Ng Jun Xiang <contact@ngjx.org>
 *
 * SPDX-License-Identifier: GPL-3.0-only
 */

import type { RouteMap } from '@pages/route-map';

// Import pages
import EventCreationPage from './create-events';
import EventList from './event-list';
import AccountSettings from './settings';
import Home from './homepage';
import FeedbackForm from './feedback';

const userRouteMap: RouteMap = {
  '/settings': {
    title: 'Account Settings',
    description: 'Check your Account Settings',
    component: AccountSettings,
    accessLevel: 'authenticated',
  },
  '/home': {
    title: 'Homepage',
    description: 'This is the homepage',
    component: Home,
    accessLevel: 'authenticated',
  },
  '/events/create': {
    title: 'Create Events',
    accessLevel: 'authenticated',
    description: 'Create Your Events Here',
    component: EventCreationPage,
  },
  '/events': {
    title: 'List Events',
    accessLevel: 'authenticated',
    description: 'List Events Here',
    component: EventList,
  },
  '/feedback': {
    title: 'Feedback Form',
    description: 'State feedback here',
    accessLevel: 'authenticated',
    component: FeedbackForm,
  },
} as const;
export default userRouteMap;
