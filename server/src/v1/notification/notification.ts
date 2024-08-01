/**
 * SPDX-FileCopyrightText: 2024 Ng Jun Xiang <contact@ngjx.org>
 *
 * SPDX-License-Identifier: GPL-3.0-only
 */

import { asc } from 'drizzle-orm';
import { db } from '../../db';
import { notificationTable } from '../../db/schemas';
import { IAuthedRouteHandler } from '../../route-map';
import {
  GetNotificationSuccAPI,
  GetNotificationFailAPI,
} from '@src/lib/api-types/notification';

//
const getNotification: IAuthedRouteHandler = async (req, res) => {
  const { id } = req.params;

  // Find id
  const castedId = parseInt(id);
  if (isNaN(castedId)) {
    return res.status(400).json({
      status: 400,
      errors: [{ message: 'Invalid ID!' }],
    } satisfies GetNotificationFailAPI);
  }

  if (castedId < 0) {
    return res.status(400).json({
      status: 400,
      errors: [{ message: 'Invalid ID!' }],
    } satisfies GetNotificationFailAPI);
  }

  // Build query
  let query = db.select().from(notificationTable).$dynamic();

  // Order
  query = query.orderBy(asc(notificationTable.id));

  const found = await query;
  return res.status(200).json({
    status: 200,
    data: found.map((n) => ({
      id: n.id,
      notificationMessage: n.notificationMessage,
      notificationType: n.notificationType,
      createdAt: n.createdAt,
      updatedAt: n.updatedAt,
    })),
  } satisfies GetNotificationSuccAPI);
};
export default getNotification;
