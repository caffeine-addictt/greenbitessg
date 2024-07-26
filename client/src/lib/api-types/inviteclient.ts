/**
 * SPDX-FileCopyrightText: 2024 Ng Jun Xiang <contact@ngjx.org>
 *
 * SPDX-License-Identifier: GPL-3.0-only
 */

import * as z from 'zod';

import { inviteclient } from './schemas';
import type { SuccessResponse } from './index';

/**
 * Successful response for /v1/user endpoint
 */
export interface GetInviteClientSuccAPI
  extends SuccessResponse<z.infer<typeof inviteclient.inviteClientSchema>> {}
