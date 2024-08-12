/**
 * SPDX-FileCopyrightText: 2024 Ng Jun Xiang <contact@ngjx.org>
 *
 * SPDX-License-Identifier: GPL-3.0-only
 */

import * as z from 'zod';

import { feedback } from './schemas';
import type { SuccessResponse, ErrorResponse } from './index';

/**
 * Successful response for /v1/feedback endpoint
 */
export interface GetFeedbackSuccAPI
  extends SuccessResponse<Array<z.infer<typeof feedback.feedbackSchema>>> {}

/**
 * Failure response for feedback-related endpoints
 */
export type GetFeedbackFailAPI = ErrorResponse<
  | 'An unexpected error occurred. Please try again later'
  | 'There was a problem accessing the database. Please try again later'
>;

/**
 * Successful response for /v1/feedback endpoint
 */
export interface CreateFeedbackSuccAPI
  extends SuccessResponse<z.infer<typeof feedback.feedbackSchema>> {}

/**
 * Failure response for feedback-related endpoints
 */
export type CreateFeedbackFailAPI = ErrorResponse<
  | 'An unexpected error occurred. Please try again later'
  | 'There was a problem accessing the database. Please try again later'
>;

/**
 * Successful response for /v1/feedback endpoint
 */
export interface DeleteFeedbackSuccAPI extends SuccessResponse<null> {}

/**
 * Failure response for feedback-related endpoints
 */
export type DeleteFeedbackFailAPI = ErrorResponse<
  | 'An unexpected error occurred. Please try again later'
  | 'There was a problem accessing the database. Please try again later'
>;
