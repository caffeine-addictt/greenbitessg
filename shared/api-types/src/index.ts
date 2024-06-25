/**
 * SPDX-FileCopyrightText: 2024 Ng Jun Xiang <contact@ngjx.org>
 *
 * SPDX-License-Identifier: GPL-3.0-only
 */

import * as auth from './auth';
import * as errors from './errors';
import * as schemas from './schemas';
import * as httpCodes from './http-codes';
import * as httpMethods from './http-methods';

export type SuccessResponse<T, N extends httpCodes.HttpOkCode = 200> = {
  status: N;
  data: T;
};

// eslint-disable-next-line @typescript-eslint/ban-types
export type ErrorResponse<T = string & {}> =
  | {
      status: httpCodes.HttpErrorCode;
      errors: T extends string
        ? errors.CustomErrorContext<T>[]
        : // eslint-disable-next-line @typescript-eslint/ban-types
          errors.CustomErrorContext<string & {}>[];
    }
  | {
      status: 401;
      errors: errors.CustomErrorContext<
        | 'No token provided!'
        | 'Invalid token!'
        | 'Token is expired!'
        | 'User does not exist!'
        | 'Unauthorized!'
      >[];
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

export const isSuccessResponse = <T>(
  response: unknown,
): response is SuccessResponse<T> => {
  try {
    return httpCodes.isOkStatusCode((response as SuccessResponse<T>).status);
  } catch {
    return false;
  }
};
export const isErrorResponse = <T>(
  response: unknown,
): response is ErrorResponse<T> => {
  try {
    return httpCodes.isErrorCode((response as ErrorResponse<T>).status);
  } catch {
    return false;
  }
};
export const isAPIResponse = <T>(
  response: unknown,
): response is SuccessResponse<T> | ErrorResponse<T> =>
  isSuccessResponse(response) || isErrorResponse(response);

export { auth, errors, schemas, httpCodes, httpMethods };
