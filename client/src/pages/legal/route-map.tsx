/**
 * SPDX-FileCopyrightText: 2024 Ng Jun Xiang <contact@ngjx.org>
 *
 * SPDX-License-Identifier: GPL-3.0-only
 */

import type { RouteMap } from '@pages/route-map';
import TosPage from './tos';
import PrivacyPage from './privacy';

const legalRouteMap: RouteMap = {
  '/tos': {
    title: 'Terms of Service',
    description: 'Our Terms of Service',
    component: TosPage,
  },
  '/privacy': {
    title: 'Privacy Policy',
    description: 'Our Privacy Policy',
    component: PrivacyPage,
  },
};
export default legalRouteMap;
