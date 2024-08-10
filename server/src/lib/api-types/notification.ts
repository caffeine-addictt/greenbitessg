/**
 * SPDX-FileCopyrightText: 2024 Ng Jun Xiang <contact@ngjx.org>
 *
 * SPDX-License-Identifier: GPL-3.0-only
 */

import type { SuccessResponse, ErrorResponse } from './index';

/**
 * Successful response for /v1/notification endpoint
 */
type Notification = {
  id: number;
  notificationMessage: string;
  notificationType: string;
  createdAt: Date;
  updatedAt: Date;
};
export interface GetNotificationSuccAPI
  extends SuccessResponse<Notification[]> {}
export type GetNotificationFailAPI = ErrorResponse<'Invalid ID!'>;

/**
 * Successful response for /v1/notification/archive
 */
export interface NotificationArchiveSuccessAPI
  extends SuccessResponse<{ deleted: true }> {}
export type NotificationArchiveFailAPI = ErrorResponse<'Invalid key!'>;
