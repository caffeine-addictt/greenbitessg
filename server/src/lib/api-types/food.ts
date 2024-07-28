/**
 * SPDX-FileCopyrightText: 2024 Ng Jun Xiang <contact@ngjx.org>
 *
 * SPDX-License-Identifier: GPL-3.0-only
 */

import type { SuccessResponse, ErrorResponse } from './index';

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
