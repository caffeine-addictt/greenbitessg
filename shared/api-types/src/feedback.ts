/**
 * SPDX-FileCopyrightText: 2024 Ng Jun Xiang <contact@ngjx.org>
 *
 * SPDX-License-Identifier: GPL-3.0-only
 */

import * as z from 'zod';

import { feedback } from './schemas';
import type { SuccessResponse } from './index';

/**
 * Successful response for /v1/feedback endpoint
 */
export interface GetFeedbackSuccAPI
  extends SuccessResponse<z.infer<typeof feedback.feedbackSchema>> {}

/**
 * Failure response for feedback-related endpoints
 */
export interface GetFeedbackFailAPI {
  error: string;
  code: number;
  details?: string; // Optional field for additional error details
}
