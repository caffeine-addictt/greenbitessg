// Backend API
//
// Copyright (C) 2024 Ng Jun Xiang <contact@ngjx.org>.
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with this program.  If not, see <http://www.gnu.org/licenses/>.

import rateLimit from 'express-rate-limit';
import type { ErrorResponse } from '@caffeine-addictt/fullstack-api-types';

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
