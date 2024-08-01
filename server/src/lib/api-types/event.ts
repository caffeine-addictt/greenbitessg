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

/**
 * Failure response for event-related endpoints
 */
export type GetEventFailAPI = ErrorResponse<
  | 'An unexpected error occurred. Please try again later'
  | 'There was a problem accessing the database. Please try again later'
  | 'Too many requests. Please try again later'
  | 'Unable to connect to the server. Please check your network connection'
  | 'Data inconsistency detected. Please refresh the page and try again'
>;

// Failure response for CreateEvent API
export type CreateEventFailAPI = ErrorResponse<
  | 'Invalid input data. Please check your form and try again'
  | 'Event could not be created. Please try again later'
  | 'There was a problem accessing the database. Please try again later'
  | 'Too many requests. Please try again later'
  | 'Unable to connect to the server. Please check your network connection'
>;

// Success response for DeleteEvent API
export interface DeleteEventSuccAPI
  extends SuccessResponse<{ deleted: true }> {}
/**
 * Failure response for delete event-related endpoints
 */
export type DeleteEventFailAPI = ErrorResponse<
  | 'Event not found'
  | 'Event could not be deleted. Please try again later'
  | 'There was a problem accessing the database. Please try again later'
  | 'Too many requests. Please try again later'
  | 'Unable to connect to the server. Please check your network connection'
>;
