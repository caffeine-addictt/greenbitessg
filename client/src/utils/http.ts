// API HTTP helper for Frontend App
// Should only be used for requests to the backend API or risk an XSS vulnerability.
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

import axios, { type AxiosRequestConfig } from 'axios';
import type {
  errors,
  SuccessResponse,
  ErrorResponse,
} from '@caffeine-addictt/fullstack-api-types';

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
const isAPIResponse = <T, D extends errors.CustomErrorContext[]>(
  // eslint-disable-next-line
  val: any,
): val is SuccessResponse<T> | ErrorResponse<D> => 'status' in val.data;

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
          if (response.status === 200) return resolve(response.data as T);
          if (isAPIResponse(response.data) && response.data.status === 200)
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
      const url = `${API_URL}/${uri}${queryParams ? `?${queryParams}` : ''}`;
      const opts: AxiosRequestConfig = withCredentials
        ? addCredentials(options ?? DEFAULT_OPTS)
        : options ?? DEFAULT_OPTS;

      axios
        .post(url, payload, opts)
        .then((response) => {
          if (response.status === 200) return resolve(response.data as T);
          if (isAPIResponse(response.data) && response.data.status === 200)
            return resolve(response.data as T);
          return reject(response);
        })
        .catch((err) => reject(err));
    });
}

const httpClient = new HTTPClient();
export default httpClient;
