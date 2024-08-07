/**
 * SPDX-FileCopyrightText: 2024 Ng Jun Xiang <contact@ngjx.org>
 *
 * SPDX-License-Identifier: GPL-3.0-only
 */

import type { SuccessResponse, ErrorResponse } from './index';

/**
 * Successful response for /api/delete-uploadthing endpoint
 */
export interface DeleteUploadThingSuccAPI
  extends SuccessResponse<{ deleted: true }> {}
export type DeleteUploadThingFailAPI = ErrorResponse<'Invalid key!'>;
