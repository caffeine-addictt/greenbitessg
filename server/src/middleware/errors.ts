/**
 * SPDX-FileCopyrightText: 2024 Ng Jun Xiang <contact@ngjx.org>
 *
 * SPDX-License-Identifier: GPL-3.0-only
 */

import express from 'express';

import routeMap, { RoutingMap } from '../route-map';
import { ErrorResponse, SuccessResponse, errors } from '../lib/api-types';

// Types
export type CustomErrorCode = Exclude<
  errors.HttpErrorCode,
  | errors.HttpErrorCode.NOT_FOUND
  | errors.HttpErrorCode.TOO_MANY_REQUESTS
  | errors.HttpErrorCode.INTERNAL_SERVER_ERROR
  | errors.HttpErrorCode.METHOD_NOT_ALLOWED
>;
export interface ErrorParameters {
  code: CustomErrorCode;
  message: string;
  context?: errors.ErrorContext;
  logging?: boolean;
}

// App Error
export class AppError extends Error {
  readonly statusCode: CustomErrorCode;
  readonly errors: errors.CustomErrorContext[];
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
      errors: err.errors as unknown as errors.CustomErrorContext<string>[],
    } satisfies ErrorResponse);
    return;
  }

  // Handle un-caught error
  res.status(500).json({
    status: 500,
    errors: [{ message: 'Something went wrong!' }],
  } satisfies ErrorResponse);
  return;
};

// Handle 404 Errors
export const notfoundHandler = (
  req: express.Request,
  res: express.Response,
  __: express.NextFunction,
) =>
  res.status(404).json({
    status: 404,
    errors: [{ message: `${req.path} is not implemented!` }],
  } satisfies ErrorResponse);

// Handle 405 Errors according to RFC
export const methodNotFoundHandler = (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) => {
  // Find the url mapping
  let routeHandlers = routeMap[req.path as unknown as keyof RoutingMap];

  // Account for /a/b/c/:id
  if (routeHandlers === undefined) {
    // Convert /a/b/c/d to /a/b/c
    const trimedRoute = req.path.slice(0, req.path.lastIndexOf('/'));
    for (const route in Object.keys(routeMap).filter((x) => x.includes(':'))) {
      // Convert /a/b/:id to RegEx pattern /a/b/[\w\d-]+ which matches words (\w), digits (\d) and hyphens (-)
      // Due to (+), /a/b/ will not match a :id.
      if (
        new RegExp(route.replace(/:(\w-\**)?/g, '([\\w-\\d]+)'), 'g').test(
          trimedRoute,
        )
      ) {
        routeHandlers = routeMap[route as unknown as keyof RoutingMap];
        break;
      }
    }
  }

  // Pass to next middleware as this is a 404 error
  if (!routeHandlers) return next();

  const allowedMethods = Object.keys(routeHandlers).join(',');
  res.setHeader('Allow', allowedMethods);

  if (req.method == 'OPTIONS')
    return res.status(200).json({
      status: 200,
      data: allowedMethods,
    } satisfies SuccessResponse<string>);
  else
    return res.status(405).json({
      status: 405,
      errors: [
        {
          message: `The ${req.method.toUpperCase()} method is not allowed for this endpoint!`,
        },
      ],
    } satisfies ErrorResponse);
};
