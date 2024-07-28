/**
 * SPDX-FileCopyrightText: 2024 Ng Jun Xiang <contact@ngjx.org>
 *
 * SPDX-License-Identifier: GPL-3.0-only
 */

import type { PageComponent, RouteMap } from '@pages/route-map';

// Import pages
import FeedbackForm from './feedback';

const userrouteMap: RouteMap = {
  '/feedback': {
    title: 'Feedback Form',
    description: 'State feedback here',
    component: FeedbackForm as PageComponent,
  },
} as const;
export default userrouteMap;
