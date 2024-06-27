/**
 * SPDX-FileCopyrightText: 2024 Ng Jun Xiang <contact@ngjx.org>
 *
 * SPDX-License-Identifier: GPL-3.0-only
 */

import * as z from 'zod';

export const eventType = z.object({
  event_id: z.number().int(),
  event_name: z.string().min(1),
  event_location: z.string().min(1),
  event_description: z.string().min(1),
});
