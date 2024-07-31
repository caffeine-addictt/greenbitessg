/**
 * SPDX-FileCopyrightText: 2024 Ng Jun Xiang <contact@ngjx.org>
 *
 * SPDX-License-Identifier: GPL-3.0-only
 */

import { and, eq } from 'drizzle-orm';
import { db } from '../../db';
import { foodTable } from '../../db/schemas';
import type { IAuthedRouteHandler } from '../../route-map';
import type {
  FoodDeleteFailAPI,
  FoodDeleteSuccessAPI,
} from '../../lib/api-types/food';

// Handler for /v1/food/delete/:id
const deleteFood: IAuthedRouteHandler = async (req, res) => {
  const { id } = req.params;
  const castedId = parseInt(id);

  if (isNaN(castedId)) {
    return res.status(400).json({
      status: 400,
      errors: [{ message: 'Invalid ID!' }],
    } satisfies FoodDeleteFailAPI);
  }

  if (castedId < 0) {
    return res.status(400).json({
      status: 400,
      errors: [{ message: 'Invalid ID!' }],
    } satisfies FoodDeleteFailAPI);
  }

  await db
    .delete(foodTable)
    .where(and(eq(foodTable.userId, req.user.id), eq(foodTable.id, castedId)));
  return res.status(200).json({
    status: 200,
    data: {
      deleted: true,
    },
  } satisfies FoodDeleteSuccessAPI);
};
export default deleteFood;
