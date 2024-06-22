/**
 * SPDX-FileCopyrightText: 2024 Ng Jun Xiang <contact@ngjx.org>
 *
 * SPDX-License-Identifier: GPL-3.0-only
 */

import axios, { type AxiosRequestConfig } from 'axios';
import { isSuccessResponse } from '@lib/api-types';
import { isOkStatusCode } from '@lib/api-types/http-codes';

// Config
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const API_VERSION = import.meta.env.VITE_API_VERSION;

const API_URL = `${API_BASE_URL}/${API_VERSION}`;

export const DEFAULT_OPTS: AxiosRequestConfig = {
  headers: {
    'Access-Control-Allow-Origin': '*',
  },
};

// Wrapper
export type IJSONSerializable = string | number | boolean | null;
export type JSONserializable =
  | IJSONSerializable
  | IJSONSerializable[]
  | { [key: string]: IJSONSerializable };
export interface APIRequestParams {
  uri: `/${string}`;
  queryParams?: string;
  withCredentials?: boolean;
  options?: AxiosRequestConfig;
}

export interface APIPayload {
  [key: string]: JSONserializable;
}
export interface APIGetRequestParams extends APIRequestParams {}
export interface APIPostRequestParams<T extends APIPayload>
  extends APIRequestParams {
  payload?: T;
}

export interface APIHttpClient {
  get<T>(params: APIGetRequestParams): Promise<T>;
  post<T, D extends APIPayload>(params: APIPostRequestParams<D>): Promise<T>;
}

// Implementation
const addCredentials = (options: AxiosRequestConfig): AxiosRequestConfig => {
  const token = sessionStorage.getItem('token');
  if (!token) {
    throw new Error('No token found');
  }

  return {
    ...options,
    headers: {
      ...options.headers,
      Authorization: `Bearer ${token}`,
    },
  };
};

class HTTPClient implements APIHttpClient {
  get = async <T>({
    uri,
    queryParams,
    withCredentials,
    options,
  }: APIGetRequestParams): Promise<T> =>
    new Promise<T>((resolve, reject) => {
      const url = `${API_URL}${uri}${queryParams ? `?${queryParams}` : ''}`;
      const opts: AxiosRequestConfig = withCredentials
        ? addCredentials(options ?? DEFAULT_OPTS)
        : options ?? DEFAULT_OPTS;

      axios
        .get<T>(url, opts)
        .then((response) => {
          if (isOkStatusCode(response.status))
            return resolve(response.data as T);
          if (isSuccessResponse(response.data))
            return resolve(response.data as T);
          return reject(response);
        })
        .catch((err) => reject(err));
    });

  post = async <T, D extends APIPayload>({
    uri,
    queryParams,
    payload,
    withCredentials,
    options,
  }: APIPostRequestParams<D>): Promise<T> =>
    new Promise<T>((resolve, reject) => {
      const url = `${API_URL}${uri}${queryParams ? `?${queryParams}` : ''}`;
      const opts: AxiosRequestConfig = withCredentials
        ? addCredentials(options ?? DEFAULT_OPTS)
        : options ?? DEFAULT_OPTS;

      axios
        .post(url, payload, opts)
        .then((response) => {
          if (isOkStatusCode(response.status))
            return resolve(response.data as T);
          if (isSuccessResponse(response.data))
            return resolve(response.data as T);
          return reject(response);
        })
        .catch((err) => reject(err));
    });
}

const httpClient = new HTTPClient();
export default httpClient;
