/**
 * SPDX-FileCopyrightText: 2024 Ng Jun Xiang <contact@ngjx.org>
 *
 * SPDX-License-Identifier: GPL-3.0-only
 */

import * as z from 'zod';

export const eventType = z.object({
  id: z.number().int(),
  name: z.string().min(1),
  location: z.string().min(1),
  description: z.string().min(1),
});
