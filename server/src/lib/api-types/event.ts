/**
 * SPDX-FileCopyrightText: 2024 Ng Jun Xiang <contact@ngjx.org>
 *
 * SPDX-License-Identifier: GPL-3.0-only
 */

import * as z from 'zod';

import { event } from './schemas';
import type { SuccessResponse } from './index';


export interface GetEventFailAPI {
  status: number;
  message: string;
}

/**
 * Successful response for /v1/user endpoint
 */
export interface GetEventSuccAPI
  extends SuccessResponse<z.infer<typeof event.eventSchema>> {}
