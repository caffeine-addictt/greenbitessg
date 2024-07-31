/**
 * SPDX-FileCopyrightText: 2024 Ng Jun Xiang <contact@ngjx.org>
 *
 * SPDX-License-Identifier: GPL-3.0-only
 */

import * as z from 'zod';

import { feedback } from './schemas';
import type { SuccessResponse } from './index';

/**
 * Successful response for /v1/feedback endpoint (GET request)
 */
export interface GetFeedbackSuccAPI
  extends SuccessResponse<z.infer<typeof feedback.feedbackSchema>> {}
