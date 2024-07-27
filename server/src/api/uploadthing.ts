/**
 * SPDX-FileCopyrightText: 2024 Ng Jun Xiang <contact@ngjx.org>
 *
 * SPDX-License-Identifier: GPL-3.0-only
 */

import {
  createRouteHandler,
  createUploadthing,
  type FileRouter,
} from 'uploadthing/express';

import { AuthenticatedRequest } from '../middleware/jwt';

import { db } from '..//db';
import { contentTable } from '../db/schemas';

const f = createUploadthing();
const uploadRouter = {
  imageRouter: f({ image: { maxFileSize: '4MB' } })
    .middleware(async ({ req }) => ({
      userId: (req as AuthenticatedRequest).user.id,
    }))
    .onUploadComplete(async ({ metadata, file }) => {
      // Save to DB
      await db.insert(contentTable).values({
        userId: metadata.userId,
        filename: file.key,
        size: file.size,
        type: file.type as 'image',
      });
    }),
} satisfies FileRouter;

export type UploadRouter = typeof uploadRouter;
export default createRouteHandler({
  router: uploadRouter,
  config: {
    uploadthingId: process.env.UPLOADTHING_APP_ID,
    uploadthingSecret: process.env.UPLOADTHING_SECRET,
  },
});
