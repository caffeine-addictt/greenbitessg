/**
 * SPDX-FileCopyrightText: 2024 Ng Jun Xiang <contact@ngjx.org>
 *
 * SPDX-License-Identifier: GPL-3.0-only
 */

/**
 * HTTP Methods.
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods}
 */
enum Methods {
  /**
   * HTTP GET request.
   * This method should only have data in the URL as query parameters.
   */
  GET = 'GET',

  /**
   * HTTP HEAD request.
   * This method should only return headers and automatically calls the HTTP GET for the same route.
   */
  HEAD = 'HEAD',

  /**
   * HTTP POST request.
   * This method can have data in the URL as query parameters and request body as JSON.
   */
  POST = 'POST',

  /**
   * HTTP PUT request.
   * This method replaces all current representations of the target resource with the request payload.
   */
  PUT = 'PUT',

  /**
   * HTTP DELETE request.
   * This method deletes the specified resource.
   */
  DELETE = 'DELETE',

  /**
   * HTTP CONNECT request.
   * This method establishes a tunnel to the server identified by the target resource.
   */
  CONNECT = 'CONNECT',

  /**
   * HTTP OPTIONS request.
   * This method describes the communication options for the target resource.
   */
  OPTIONS = 'OPTIONS',

  /**
   * HTTP TRACE request.
   * This method performs a message loop-back test along the path to the target resource.
   */
  TRACE = 'TRACE',

  /**
   * HTTP PATCH request.
   * This method applies partial modifications to a resource.
   */
  PATCH = 'PATCH',
}

export const isHttpMethod = (method: unknown): method is Methods =>
  (method as string) in Methods;

export default Methods;
