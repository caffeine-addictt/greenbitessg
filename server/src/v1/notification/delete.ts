/**
 * SPDX-FileCopyrightText: 2024 Ng Jun Xiang <contact@ngjx.org>
 *
 * SPDX-License-Identifier: GPL-3.0-only
 */

import { and, eq } from 'drizzle-orm';
import { db } from '../../db';
import { notificationTable } from '../../db/schemas';
import type { IAuthedRouteHandler } from '../../route-map';
import type {
  NotificationArchiveSuccessAPI,
  NotificationArchiveFailAPI,
} from '../../lib/api-types/notification';

// Handler for /v1/notification/archive
const archiveNotification: IAuthedRouteHandler = async (req, res) => {
  const { id } = req.params;
  const castedId = parseInt(id);

  if (isNaN(castedId)) {
    return res.status(400).json({
      status: 400,
      errors: [{ message: 'Invalid ID!' }],
    } satisfies NotificationArchiveFailAPI);
  }

  if (castedId < 0) {
    return res.status(400).json({
      status: 400,
      errors: [{ message: 'Invalid ID!' }],
    } satisfies NotificationArchiveFailAPI);
  }

  await db
    .delete(notificationTable)
    .where(
      and(
        eq(notificationTable.userId, req.user.id),
        eq(notificationTable.id, castedId),
      ),
    );

  return res.status(200).json({
    status: 200,
    data: {
      deleted: true,
    },
  } satisfies NotificationArchiveSuccessAPI);
};
export default archiveNotification;
