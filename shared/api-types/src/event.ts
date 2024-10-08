/**
 * SPDX-FileCopyrightText: 2024 Ng Jun Xiang <contact@ngjx.org>
 *
 * SPDX-License-Identifier: GPL-3.0-only
 */

import * as z from 'zod';

import { event } from './schemas';
import type { SuccessResponse, ErrorResponse } from './index';

// Success response for GetEvent API
export interface GetEventSuccAPI
  extends SuccessResponse<Array<z.infer<typeof event.eventSchema>>> {}

// Success response for CreateEvent API
export interface CreateEventSuccAPI
  extends SuccessResponse<z.infer<typeof event.eventSchema>> {}

// Success response for JoinEvent API
export interface JoinEventSuccAPI
  extends SuccessResponse<z.infer<typeof event.joinEvent>> {}

// Success response for LeaveEvent API
export interface LeaveEventSuccAPI
  extends SuccessResponse<z.infer<typeof event.joinEvent>> {}

/**
 * Failure response for event-related endpoints
 */
export type JoinEventFailAPI =
  ErrorResponse<'An error occured joining event. Please try again later.'>;

/**
 * Failure response for event-related endpoints
 */
export type GetEventFailAPI = ErrorResponse<'No events found!'>;

// Failure response for CreateEvent API
export type CreateEventFailAPI =
  ErrorResponse<'An unexpected error occurred. Please try again later.'>;

// Success response for DeleteEvent API
export interface DeleteEventSuccAPI extends SuccessResponse<null> {}
/**
 * Failure response for delete event-related endpoints
 */
export type DeleteEventFailAPI = ErrorResponse<'Invalid id!'>;
