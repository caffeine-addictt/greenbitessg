/**
 * SPDX-FileCopyrightText: 2024 Ng Jun Xiang <contact@ngjx.org>
 *
 * SPDX-License-Identifier: GPL-3.0-only
 */

import type { RouteMap } from '@pages/route-map';
import TosPage from './tos';

const legalRouteMap: RouteMap = {
  '/tos': {
    title: 'Terms of Service',
    description: 'Our Terms of Service',
    component: TosPage,
  },
};
export default legalRouteMap;
