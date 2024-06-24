/**
 * SPDX-FileCopyrightText: 2024 Ng Jun Xiang <contact@ngjx.org>
 *
 * SPDX-License-Identifier: GPL-3.0-only
 */

import * as z from 'zod';

import { user } from './schemas';
import type { SuccessResponse } from './index';

/**
 * Successful response for /v1/user endpoint
 */
export interface GetUserSuccAPI
  extends SuccessResponse<z.infer<typeof user.userType>> {}
