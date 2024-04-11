/**
 * SPDX-FileCopyrightText: 2024 Ng Jun Xiang <contact@ngjx.org>
 *
 * SPDX-License-Identifier: GPL-3.0-only
 */

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
