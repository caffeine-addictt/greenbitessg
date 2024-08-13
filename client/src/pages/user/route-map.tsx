/**
 * SPDX-FileCopyrightText: 2024 Ng Jun Xiang <contact@ngjx.org>
 *
 * SPDX-License-Identifier: GPL-3.0-only
 */

import type { RouteMap } from '@pages/route-map';

// Import pages
import EventCreationPage from './create-events';
import EventList from './event-list';
import getEvent from './join-events';
import AccountSettings from './settings';
import Home from './homepage';
import FeedbackForm from './feedback';
import DashboardPage from './dashboard';
import FeedbackList from './feedback-list';
import MyEvents from './events-me-list';
import EventView from './events-me';

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
    accessLevel: 'public',
    description: 'List Events Here',
    component: EventList,
  },
  '/events/:id': {
    title: 'view event',
    accessLevel: 'public',
    description: 'View individual event',
    component: getEvent,
  },
  '/events/me': {
    title: 'view my event',
    accessLevel: 'authenticated',
    description: 'View events that have been signed up',
    component: MyEvents,
  },
  '/events/me/:id': {
    title: 'view event',
    accessLevel: 'authenticated',
    description: 'View individual events that have been signed up',
    component: EventView,
  },
  '/dashboard': {
    title: 'Dashboard',
    description: 'Check all the relevant details here',
    component: DashboardPage,
    accessLevel: 'admin',
  },
  '/feedback/create': {
    title: 'Feedback Form',
    description: 'State feedback here',
    accessLevel: 'authenticated',
    component: FeedbackForm,
  },
  '/feedback': {
    title: 'Feedback List',
    description: 'List feedback',
    accessLevel: 'public',
    component: FeedbackList,
  },
} as const;
export default userRouteMap;
