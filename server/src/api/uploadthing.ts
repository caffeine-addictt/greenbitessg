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

const f = createUploadthing();
const uploadRouter = {
  imageRouter: f({
    image: {
      maxFileCount: 4,
      maxFileSize: '4MB',
    },
  }).onUploadComplete((data) => {
    console.log('Upload Success', data);
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
