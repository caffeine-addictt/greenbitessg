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

export const createEventFormSchema = z.object({
  namename: z
    .string({
      invalid_type_error: 'Please provide an event name!',
      required_error: 'Please provide an event name!',
    })
    .min(1, { message: ' Please provide an event name!' })
    .min(3, { message: 'Event name needs to be at least 3 characters!' })
    .max(20, { message: 'Event name cannot be longer than 20 characters!' })
    .regex(/^[\w\d-_]+$/, {
      message: 'Event name may only contain alphanumeric characters and (-_)',
    }),
  location: z
    .string({
      invalid_type_error: 'Please provide a location',
      required_error: 'Please provide a location',
    })
    .min(1, { message: 'Please provide a location' }),

  description: z
    .string({
      invalid_type_error: 'Please provide a description!',
      required_error: 'Please provide a description!',
    })
    .min(1, { message: 'Please provide a description!' })
    .min(8, { message: 'description needs to be at least 8 characters!' }),
});
