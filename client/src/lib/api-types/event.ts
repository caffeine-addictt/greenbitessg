/**
 * SPDX-FileCopyrightText: 2024 Ng Jun Xiang <contact@ngjx.org>
 *
 * SPDX-License-Identifier: GPL-3.0-only
 */

import * as z from 'zod';

import { event } from './schemas';
import type { SuccessResponse } from './index';
import type { ErrorResponse } from 'react-router-dom';

export type GetEventFailAPI = ErrorResponse & {
  details: 'Please key in an event';
};

export interface GetEventSuccAPI
  extends SuccessResponse<z.infer<typeof event.eventSchema>> {}
