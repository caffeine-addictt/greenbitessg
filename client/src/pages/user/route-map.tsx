/**
 * SPDX-FileCopyrightText: 2024 Ng Jun Xiang <contact@ngjx.org>
 *
 * SPDX-License-Identifier: GPL-3.0-only
 */

import type { RouteMap } from '@pages/route-map';

// Import pages
import FeedbackForm from './feedback';

const userrouteMap: RouteMap = {
  '/feedback': {
    title: 'Feedback Form',
    description: 'State feedback here',
    accessLevel: 'authenticated',
    component: FeedbackForm,
  },
} as const;
export default userrouteMap;
