/**
 * SPDX-FileCopyrightText: 2024 Ng Jun Xiang <contact@ngjx.org>
 *
 * SPDX-License-Identifier: GPL-3.0-only
 */

import axios, {
  AxiosError,
  isAxiosError,
  type AxiosRequestConfig,
} from 'axios';
import { isSuccessResponse } from '@lib/api-types';
import { getAuthCookie } from './jwt';

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
export type IJSONSerializable = string | number | boolean | unknown | null;
export type JSONserializable =
  | IJSONSerializable
  | IJSONSerializable[]
  | { [key: string]: IJSONSerializable };
export interface APIRequestParams {
  uri: `/${string}`;
  queryParams?: string;
  withCredentials?: 'access' | 'refresh';
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
const addCredentials = (
  tokenType: 'access' | 'refresh',
  options: AxiosRequestConfig,
): AxiosRequestConfig => {
  const token = getAuthCookie(tokenType);
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
  }: APIGetRequestParams): Promise<T> => {
    const url = `${API_URL}${uri}${queryParams ? `?${queryParams}` : ''}`;
    const opts: AxiosRequestConfig = withCredentials
      ? addCredentials(withCredentials, options ?? DEFAULT_OPTS)
      : (options ?? DEFAULT_OPTS);

    const resp = await axios.get<T>(url, opts).catch((err: AxiosError) => err);
    const isErr = isAxiosError(resp);

    if (!isErr && isSuccessResponse(resp.data)) {
      return resp.data;
    } else if (!isErr) {
      throw resp;
    }

    // See if cached
    const data = resp.response?.data as T;
    if (!data) throw resp;

    // Resolve if cached is OK
    if (isSuccessResponse(data)) return data;

    throw resp;
  };

  post = async <T, D extends APIPayload>({
    uri,
    queryParams,
    payload,
    withCredentials,
    options,
  }: APIPostRequestParams<D>): Promise<T> => {
    const url = `${API_URL}${uri}${queryParams ? `?${queryParams}` : ''}`;
    const opts: AxiosRequestConfig = withCredentials
      ? addCredentials(withCredentials, options ?? DEFAULT_OPTS)
      : (options ?? DEFAULT_OPTS);

    const resp = await axios
      .post<T>(url, payload, opts)
      .catch((err: AxiosError) => err);
    const isErr = isAxiosError(resp);

    if (!isErr && isSuccessResponse(resp.data)) {
      return resp.data;
    } else if (!isErr) {
      throw resp;
    }

    // See if cached
    const data = resp.response?.data as T;
    if (!data) throw resp;

    // Resolve if cached is OK
    if (isSuccessResponse(data)) return data;

    throw resp;
  };
}

const httpClient = new HTTPClient();
export default httpClient;
