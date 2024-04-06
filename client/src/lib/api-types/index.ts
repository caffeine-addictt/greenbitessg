// Shared API Types
//
// Copyright (C) 2024 Ng Jun Xiang <contact@ngjx.org>
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

import * as auth from './auth';
import * as errors from './errors';
import * as schemas from './schemas';
import httpMethods from './http-methods';

export type SuccessResponse<T, N = 200> = {
  status: N;
  data: T;
};

// eslint-disable-next-line @typescript-eslint/ban-types
export type ErrorResponse<T = string & {}> =
  | {
      status: errors.HttpErrorCode;
      errors: T extends string
        ? errors.CustomErrorContext<T>[]
        : // eslint-disable-next-line @typescript-eslint/ban-types
          errors.CustomErrorContext<string & {}>[];
    }
  | {
      status: 429;
      errors: [
        errors.CustomErrorContext<'Too many requests, please try again later'>,
      ];
    }
  | {
      status: 500;
      errors: errors.CustomErrorContext<'Something went wrong!'>[];
    }
  | {
      status: 404;
      errors: [errors.CustomErrorContext<`/${string} is not implemented!`>];
    }
  | {
      status: 405;
      errors: [
        errors.CustomErrorContext<`The ${keyof typeof httpMethods} method is not allowed for this endpoint!`>,
      ];
    };

export { auth, errors, schemas, httpMethods };
