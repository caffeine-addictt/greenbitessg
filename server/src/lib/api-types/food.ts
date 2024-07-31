/**
 * SPDX-FileCopyrightText: 2024 Ng Jun Xiang <contact@ngjx.org>
 *
 * SPDX-License-Identifier: GPL-3.0-only
 */

import type { SuccessResponse, ErrorResponse } from './index';

/**
 * Successful response for /v1/food endpoint
 */
type Food = {
  id: number;
  name: string;
  servingUnit: string;
  servingQty: number;
  calories: number;
  imageUrl: string;
  createdAt: Date;
  updatedAt: Date;
};
export interface FoodGetSuccessAPI extends SuccessResponse<Food[]> {}
export interface FoodGetIdSuccessAPI extends SuccessResponse<Food> {}
export type FoodGetFailAPI = ErrorResponse<
  | 'Invalid ID!'
  | 'ID does not exist!'
  | 'Invalid query!'
  | 'Invalid limit!'
  | 'Invalid page!'
>;

/**
 * Successful response for /v1/food/generate endpoint
 */
export interface FoodGenerateSuccessAPI
  extends SuccessResponse<{ id: number }, 201> {}
export type FoodGenerateFailAPI = ErrorResponse<
  | 'Please provide an image!'
  | 'Image is invalid!'
  | 'Could not access image!'
  | 'Could not identify food from image!'
  | 'Could not get nutrition info!'
  | 'Could not access image!'
>;

/**
 * Successful response for /v1/food/delete endpoint
 */
export interface FoodDeleteSuccessAPI
  extends SuccessResponse<{ deleted: true }> {}
export type FoodDeleteFailAPI = ErrorResponse<'Invalid ID!'>;