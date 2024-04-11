/**
 * SPDX-FileCopyrightText: 2024 Ng Jun Xiang <contact@ngjx.org>
 *
 * SPDX-License-Identifier: GPL-3.0-only
 */

import rateLimit from 'express-rate-limit';
import type { ErrorResponse } from '../lib/api-types';

export default rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests within the window
  standardHeaders: true,
  handler: (_, res, __) => {
    return res.status(429).json({
      status: 429,
      errors: [{ message: 'Too many requests, please try again later' }],
    } satisfies ErrorResponse);
  },
});
