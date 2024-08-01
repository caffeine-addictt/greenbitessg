/**
 * SPDX-FileCopyrightText: 2024 Ng Jun Xiang <contact@ngjx.org>
 *
 * SPDX-License-Identifier: GPL-3.0-only
 */

import * as z from 'zod';

export const deleteImageSchema = z.object({
  key: z
    .string({
      invalid_type_error: 'Please provide a key!',
      required_error: 'Please provide a key!',
    })
    .min(1, { message: 'Please provide a key!' }),
});
