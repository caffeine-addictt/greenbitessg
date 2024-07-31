/**
 * SPDX-FileCopyrightText: 2024 Ng Jun Xiang <contact@ngjx.org>
 *
 * SPDX-License-Identifier: GPL-3.0-only
 */

import * as z from 'zod';

export const foodGenerateFormSchema = z.object({
  image: z
    .string({
      invalid_type_error: 'Please provide an image!',
      required_error: 'Please provide an image!',
    })
    .min(1, { message: 'Please provide an image!' }),
});
