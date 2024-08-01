/**
 * SPDX-FileCopyrightText: 2024 Ng Jun Xiang <contact@ngjx.org>
 *
 * SPDX-License-Identifier: GPL-3.0-only
 */

import type { RouteMap } from '@pages/route-map';
import FoodPage from './food';

const foodRouteMap: RouteMap = {
  '/food': {
    title: 'Food',
    description: 'Stay on top of your food intake!',
    accessLevel: 'authenticated',
    component: FoodPage,
  },
};
export default foodRouteMap;
