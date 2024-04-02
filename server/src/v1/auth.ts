// Backend API v1
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

import { auth } from '@caffeine-addictt/fullstack-api-types';
import { RouteHandler } from '../route-map';

export const availability: RouteHandler = (_, res) => {
  res.status(200).json({
    status: 200,
    data: {
      available: true,
    },
  } satisfies auth.AvailabilityAPI);
};
