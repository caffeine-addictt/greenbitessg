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

import express from 'express';
import errorCodes from '../utils/error-code';

// Types
export interface ErrorContext {
  [x: string]: unknown;
}
export interface ErrorParameters {
  code: errorCodes;
  message: string;
  context?: ErrorContext;
  logging?: boolean;
}

export type CustomErrorContext = {
  message: string;
  context?: ErrorContext;
};

// App Error
export class AppError extends Error {
  readonly statusCode: number;
  readonly errors: CustomErrorContext[];
  readonly logging: boolean;

  constructor(params: ErrorParameters) {
    const { code, message, logging, context } = params;

    super(message);
    this.statusCode = code;
    this.logging = logging || false;
    this.errors = [{ message: message, context: context }];

    Object.setPrototypeOf(this, AppError.prototype);
  }
}

// Handle Errors
export const errorHandler = (
  err: Error,
  _: express.Request,
  res: express.Response,
  __: express.NextFunction,
): void => {
  // Handle custom error
  if (err instanceof AppError) {
    if (err.logging)
      console.error(
        JSON.stringify(
          {
            statusCode: err.statusCode,
            errors: err.errors,
            stack: err.stack,
          },
          null,
          2,
        ),
      );

    res.status(err.statusCode).json({
      status: err.statusCode,
      errors: err.errors,
    });
    return;
  }

  // Handle un-caught error
  res.status(500).json({ errors: [{ message: 'Something went wrong!' }] });
  return;
};

// Handle 404 Errors
export const notfoundHandler = (
  req: express.Request,
  res: express.Response,
  __: express.NextFunction,
): void => {
  res
    .status(404)
    .json({ status: 404, message: `${req.path} is not implemented!` });
};
