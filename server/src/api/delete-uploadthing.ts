/**
 * SPDX-FileCopyrightText: 2024 Ng Jun Xiang <contact@ngjx.org>
 *
 * SPDX-License-Identifier: GPL-3.0-only
 */

import { utapi } from '../utils/service/cdn';

import type { ZodIssue } from 'zod';
import type { IAuthedRouteHandler } from '../route-map';

import { Http4XX } from '../lib/api-types/http-codes';
import type { errors } from '../lib/api-types';
import type {
  DeleteUploadThingSuccAPI,
  DeleteUploadThingFailAPI,
} from '../lib/api-types/uploadthing';

import { deleteImageSchema } from '../lib/api-types/schemas/uploadthing';
import { db } from '../db';
import { and, eq } from 'drizzle-orm';
import { contentTable } from '../db/schemas';

const deletehandler: IAuthedRouteHandler = async (req, res) => {
  // Validate request body
  const validated = deleteImageSchema.safeParse(req.body);
  if (!validated.success) {
    const errorStack: errors.CustomErrorContext[] = [];
    validated.error.errors.forEach((error: ZodIssue) => {
      errorStack.push({
        message: error.message,
        context: {
          property: error.path,
          code: error.code,
        },
      });
    });

    return res.status(Http4XX.BAD_REQUEST).json({
      status: Http4XX.BAD_REQUEST,
      errors: errorStack,
    } satisfies DeleteUploadThingFailAPI);
  }

  // Find image
  const [found] = await db
    .select({})
    .from(contentTable)
    .where(
      and(
        eq(contentTable.filename, validated.data.key),
        eq(contentTable.userId, req.user.id),
      ),
    )
    .limit(1);
  if (!found) {
    return res.status(404).json({
      status: 404,
      errors: [
        {
          message: 'Image not found',
          context: {
            property: 'key',
          },
        },
      ],
    } satisfies DeleteUploadThingFailAPI);
  }

  // Delete from S3
  await utapi.deleteFiles(validated.data.key);

  // Deleting DB
  await db
    .delete(contentTable)
    .where(
      and(
        eq(contentTable.filename, validated.data.key),
        eq(contentTable.userId, req.user.id),
      ),
    );

  return res.status(200).json({
    status: 200,
    data: {
      deleted: true,
    },
  } satisfies DeleteUploadThingSuccAPI);
};
export default deletehandler;
