/**
 * SPDX-FileCopyrightText: 2024 Ng Jun Xiang <contact@ngjx.org>
 *
 * SPDX-License-Identifier: GPL-3.0-only
 */

import { and, asc, eq, like } from 'drizzle-orm';
import { db } from '../../db';
import { foodTable } from '../../db/schemas';
import type { IAuthedRouteHandler } from '../../route-map';
import type {
  FoodGetFailAPI,
  FoodGetIdSuccessAPI,
  FoodGetSuccessAPI,
} from '../../lib/api-types/food';

// Handler for /v1/food GET and /v1/food/:id GET
const getFood: IAuthedRouteHandler = async (req, res) => {
  const { id } = req.params;
  const { q, limit, page } = req.query;

  // Find range
  if (!id) {
    // Validate query
    if (
      (q !== undefined && typeof q !== 'string') ||
      (limit !== undefined && typeof limit !== 'string') ||
      (page !== undefined && typeof page !== 'string')
    ) {
      return res.status(400).json({
        status: 400,
        errors: [{ message: 'Invalid query!' }],
      } satisfies FoodGetFailAPI);
    }

    // Validate limit
    let limitNum = 20;
    if (limit) {
      limitNum = parseInt(limit);
      if (isNaN(limitNum)) {
        return res.status(400).json({
          status: 400,
          errors: [{ message: 'Invalid limit!' }],
        } satisfies FoodGetFailAPI);
      }

      if (limitNum > 20 || limitNum < 1) {
        return res.status(400).json({
          status: 400,
          errors: [{ message: 'Invalid limit!' }],
        } satisfies FoodGetFailAPI);
      }
    }

    // Validate page
    let pageNum = 1;
    if (page) {
      pageNum = parseInt(page);
      if (isNaN(pageNum)) {
        return res.status(400).json({
          status: 400,
          errors: [{ message: 'Invalid page!' }],
        } satisfies FoodGetFailAPI);
      }

      if (pageNum < 1) {
        return res.status(400).json({
          status: 400,
          errors: [{ message: 'Invalid page!' }],
        } satisfies FoodGetFailAPI);
      }
    }

    // Build query
    let query = db.select().from(foodTable).$dynamic();

    // Handle query searchParam
    query = q
      ? query.where(
          and(eq(foodTable.userId, req.user.id), like(foodTable.name, q)),
        )
      : query.where(eq(foodTable.userId, req.user.id));

    // Order
    query = query.orderBy(asc(foodTable.id));

    // Handle query limit
    const after = (pageNum - 1) * limitNum;
    query = query.limit(limitNum).offset(after);

    const found = await query;
    return res.status(200).json({
      status: 200,
      data: found.map((f) => ({
        id: f.id,
        name: f.name,
        calories: f.calories,
        servingQty: f.servingQty,
        servingUnit: f.servingUnit,
        imageUrl: `https://utfs.io/f/${f.imageId}`,
        createdAt: f.createdAt,
        updatedAt: f.updatedAt,
      })),
    } satisfies FoodGetSuccessAPI);
  }

  // Find id
  const castedId = parseInt(id);
  if (isNaN(castedId)) {
    return res.status(400).json({
      status: 400,
      errors: [{ message: 'Invalid ID!' }],
    } satisfies FoodGetFailAPI);
  }

  if (castedId < 0) {
    return res.status(400).json({
      status: 400,
      errors: [{ message: 'Invalid ID!' }],
    } satisfies FoodGetFailAPI);
  }

  const found = await db
    .select()
    .from(foodTable)
    .where(and(eq(foodTable.userId, req.user.id), eq(foodTable.id, castedId)))
    .limit(1);
  if (found.length === 0) {
    return res.status(404).json({
      status: 404,
      errors: [{ message: 'ID does not exist!' }],
    } satisfies FoodGetFailAPI);
  }

  return res.status(200).json({
    status: 200,
    data: {
      id: found[0].id,
      name: found[0].name,
      calories: found[0].calories,
      servingQty: found[0].servingQty,
      servingUnit: found[0].servingUnit,
      imageUrl: `https://utfs.io/f/${found[0].imageId}`,
      createdAt: found[0].createdAt,
      updatedAt: found[0].updatedAt,
    },
  } satisfies FoodGetIdSuccessAPI);
};
export default getFood;
