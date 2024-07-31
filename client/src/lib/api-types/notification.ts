/**
 * SPDX-FileCopyrightText: 2024 Ng Jun Xiang <contact@ngjx.org>
 *
 * SPDX-License-Identifier: GPL-3.0-only
 */

import * as z from 'zod';

import { notification } from './schemas';
import type { SuccessResponse, ErrorResponse } from './index';

/**
 * Successful response for /v1/feedback endpoint
 */
export interface GetNotificationSuccAPI
  extends SuccessResponse<z.infer<typeof notification.notificationSchema>> {}

/**
 * Failure response for feedback-related endpoints
 */
export type GetNotificationFailAPI = ErrorResponse<
  | 'An unexpected error occurred. Please try again later'
  | 'There was a problem accessing the database. Please try again later'
  | 'Too many requests. Please try again later'
  | 'Unable to connect to the server. Please check your network connection'
  | 'Data inconsistency detected. Please refresh the page and try again'
>;
