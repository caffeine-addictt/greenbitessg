/**
 * SPDX-FileCopyrightText: 2024 Ng Jun Xiang <contact@ngjx.org>
 *
 * SPDX-License-Identifier: GPL-3.0-only
 */

import type { RouteMap } from '@pages/route-map';

// Import pages
import EventCreationPage from './create-events';
import EventManage from './event-manage';
import EventList from './event-list';
import getEvent from './join-events';
import AccountSettings from './settings';
import Home from './homepage';
import FeedbackForm from './feedback';
import DashboardPage from './dashboard';
import FeedbackList from './feedback-list';
import MyEvents from './my-events-list';
import EventView from './my-events';

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
  '/events/manage': {
    title: 'Event Management',
    accessLevel: 'authenticated',
    description: 'Event Management',
    component: EventManage,
  },
  '/events': {
    title: 'Events',
    accessLevel: 'public',
    description: 'Event List',
    component: EventList,
  },
  '/events/:id': {
    title: 'view event',
    accessLevel: 'public',
    description: 'View individual event',
    component: getEvent,
  },
  '/my-events': {
    title: 'view my event',
    accessLevel: 'authenticated',
    description: 'View events that have been signed up',
    component: MyEvents,
  },
  '/my-events/:id': {
    title: 'view event',
    accessLevel: 'authenticated',
    description: 'View individual events that have been signed up',
    component: EventView,
  },
  '/dashboard': {
    title: 'Dashboard',
    description: 'Check all the relevant details here',
    component: DashboardPage,
    accessLevel: 'authenticated',
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
    accessLevel: 'authenticated',
    component: FeedbackList,
  },
} as const;
export default userRouteMap;
