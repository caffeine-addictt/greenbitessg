/**
 * SPDX-FileCopyrightText: 2024 Ng Jun Xiang <contact@ngjx.org>
 *
 * SPDX-License-Identifier: GPL-3.0-only
 */

import { db } from '../../db';
import { notificationTable } from '../../db/schemas';
import { IAuthedRouteHandler } from '../../route-map';
import { GetNotificationSuccAPI } from '../../lib/api-types/notification';
import { eq } from 'drizzle-orm';

//
const getNotification: IAuthedRouteHandler = async (req, res) => {
  const found = await db
    .select({
      id: notificationTable.id,
      notificationMessage: notificationTable.notificationMessage,
      notificationType: notificationTable.notificationType,
      createdAt: notificationTable.createdAt,
      updatedAt: notificationTable.updatedAt,
    })
    .from(notificationTable)
    .where(eq(notificationTable.userId, req.user.id));

  return res.status(200).json({
    status: 200,
    data: found,
  } satisfies GetNotificationSuccAPI);
};
export default getNotification;
