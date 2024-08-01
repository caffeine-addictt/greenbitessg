/**
 * SPDX-FileCopyrightText: 2024 Ng Jun Xiang <contact@ngjx.org>
 *
 * SPDX-License-Identifier: GPL-3.0-only
 */

import axios, {
  AxiosError,
  AxiosResponse,
  isAxiosError,
  type AxiosRequestConfig,
} from 'axios';
import { isSuccessResponse } from '@lib/api-types';
import { getAuthCookie } from './jwt';

// Config
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const API_VERSION = import.meta.env.VITE_API_VERSION;

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
  fromRoot?: boolean;
}

export interface APIPayload {
  [key: string]: JSONserializable;
}
export interface APIGetRequestParams extends APIRequestParams {}
export interface APIPostRequestParams<T extends APIPayload>
  extends APIRequestParams {
  payload?: T;
}
export interface APIPutRequestParams<T extends APIPayload>
  extends APIPostRequestParams<T> {}

export interface APIHttpClient {
  get<T>(params: APIGetRequestParams): Promise<T>;
  post<T, D extends APIPayload>(params: APIPostRequestParams<D>): Promise<T>;
  put<T, D extends APIPayload>(params: APIPutRequestParams<D>): Promise<T>;
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

const resolveUrl = ({
  uri,
  queryParams,
  fromRoot = false,
}: Pick<APIRequestParams, 'uri' | 'queryParams' | 'fromRoot'>): string =>
  fromRoot
    ? `${API_BASE_URL}${uri}${queryParams ? `?${queryParams}` : ''}`
    : `${API_BASE_URL}/${API_VERSION}${uri}${queryParams ? `?${queryParams}` : ''}`;

const httpRequestWithCacheHandling = async <T>(
  httpRequest: Promise<AxiosResponse<T, unknown>>,
): Promise<T> => {
  const resp = await httpRequest.catch((err: AxiosError) => err);
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

class HTTPClient implements APIHttpClient {
  get = async <T>({
    withCredentials,
    options,
    ...uri
  }: APIGetRequestParams): Promise<T> => {
    const url = resolveUrl(uri);
    const opts: AxiosRequestConfig = withCredentials
      ? addCredentials(withCredentials, options ?? DEFAULT_OPTS)
      : (options ?? DEFAULT_OPTS);

    return httpRequestWithCacheHandling<T>(axios.get<T>(url, opts));
  };

  post = async <T, D extends APIPayload>({
    payload,
    withCredentials,
    options,
    ...uri
  }: APIPostRequestParams<D>): Promise<T> => {
    const url = resolveUrl(uri);
    const opts: AxiosRequestConfig = withCredentials
      ? addCredentials(withCredentials, options ?? DEFAULT_OPTS)
      : (options ?? DEFAULT_OPTS);

    return httpRequestWithCacheHandling<T>(axios.post<T>(url, payload, opts));
  };

  put = async <T, D extends APIPayload>({
    payload,
    withCredentials,
    options,
    ...uri
  }: APIPutRequestParams<D>): Promise<T> => {
    const url = resolveUrl(uri);
    const opts: AxiosRequestConfig = withCredentials
      ? addCredentials(withCredentials, options ?? DEFAULT_OPTS)
      : (options ?? DEFAULT_OPTS);

    return httpRequestWithCacheHandling<T>(axios.put<T>(url, payload, opts));
  };


  };
}

const httpClient = new HTTPClient();
export default httpClient;
