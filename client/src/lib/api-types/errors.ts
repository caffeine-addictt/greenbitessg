/**
 * SPDX-FileCopyrightText: 2024 Ng Jun Xiang <contact@ngjx.org>
 *
 * SPDX-License-Identifier: GPL-3.0-only
 */

import httpMethods from './http-methods';
import { HttpErrorCode } from './http-codes';

export interface ErrorContext {
  [x: string]: unknown;
}

export type HintedString<KnownTypes extends string> =
  // eslint-disable-next-line @typescript-eslint/ban-types
  (string & {}) | KnownTypes;
// eslint-disable-next-line @typescript-eslint/ban-types
export type CustomErrorContext<T = string & {}> = {
  message: HintedString<T extends string ? T : string>;
  context?: ErrorContext;
};

export type SuccessResponse<T> = {
  status: 200;
  data: T;
};

// eslint-disable-next-line @typescript-eslint/ban-types
export type ErrorResponse<T = string & {}> =
  | {
      status: HttpErrorCode;
      errors: T extends string
        ? CustomErrorContext<T>[]
        : // eslint-disable-next-line @typescript-eslint/ban-types
          CustomErrorContext<string & {}>[];
    }
  | {
      status: 401;
      errors: CustomErrorContext<
        | 'No token provided!'
        | 'Invalid token!'
        | 'Token is expired!'
        | 'User does not exist!'
        | 'Account not activated!'
        | 'Unauthorized!'
      >[];
    }
  | {
      status: 429;
      errors: [CustomErrorContext<'Too many requests, please try again later'>];
    }
  | {
      status: 500;
      errors: CustomErrorContext<'Something went wrong!'>[];
    }
  | {
      status: 404;
      errors: [CustomErrorContext<`/${string} is not implemented!`>];
    }
  | {
      status: 405;
      errors: [
        CustomErrorContext<`The ${keyof typeof httpMethods} method is not allowed for this endpoint!`>,
      ];
    };
