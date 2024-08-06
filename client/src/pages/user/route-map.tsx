/**
 * SPDX-FileCopyrightText: 2024 Ng Jun Xiang <contact@ngjx.org>
 *
 * SPDX-License-Identifier: GPL-3.0-only
 */

import type { RouteMap } from '@pages/route-map';

// Import pages
import FeedbackForm from './feedback';
import FeedbackList from './feedback-list';

const userrouteMap: RouteMap = {
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
export default userrouteMap;
