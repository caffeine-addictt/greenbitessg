/**
 * SPDX-FileCopyrightText: 2024 Ng Jun Xiang <contact@ngjx.org>
 *
 * SPDX-License-Identifier: GPL-3.0-only
 */

import { auth } from '../lib/api-types';
import { Http4XX } from '../lib/api-types/http-codes';
import { ErrorResponse } from '../lib/api-types/errors';
import { IBareRouteHandler } from '../route-map';

import { db } from '../db';
import { eq } from 'drizzle-orm';
import { usersTable } from '../db/schemas';

export const availability: IBareRouteHandler = async (req, res) => {
  const username = req.query.username;

  if (typeof username !== 'string') {
    return res.status(Http4XX.BAD_REQUEST).json({
      status: Http4XX.BAD_REQUEST,
      errors: [{ message: 'Missing username' }],
    } satisfies ErrorResponse);
  }

  const user = await db
    .select({})
    .from(usersTable)
    .where(eq(usersTable.username, username))
    .limit(1);

  return res.status(200).json({
    status: 200,
    data: {
      available: user.length === 0,
    },
  } satisfies auth.AvailabilityAPI);
};
