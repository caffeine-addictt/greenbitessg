/**
 * SPDX-FileCopyrightText: 2024 Ng Jun Xiang <contact@ngjx.org>
 *
 * SPDX-License-Identifier: GPL-3.0-only
 */

import * as z from 'zod';
import { AxiosError, isAxiosError } from 'axios';
import { createContext, useCallback, useState, useEffect } from 'react';

import httpClient from '@utils/http';
import { auth } from '@lib/api-types';
import { userType } from '@lib/api-types/schemas/user';
import { GetUserSuccAPI } from '@lib/api-types/user';
import { RefreshFailAPI, RefreshSuccAPI } from '@lib/api-types/auth';
import { getAuthCookie, setAuthCookie, unsetAuthCookie } from '@utils/jwt';
import { refreshTokenSchema } from '@lib/api-types/schemas/auth';

export type AuthContextType = {
  state: AuthProviderState;
  user: z.infer<typeof userType> | null;
  isLoggedIn: boolean;
  isAdmin: boolean;
  isActivated: boolean;
  refetch: () => Promise<void>;
  login: (tokens: auth.LoginSuccAPI['data']) => void;
  logout: () => Promise<unknown>;
};
export const AuthContext = createContext<AuthContextType | null>(null);

/** Try to get user info */
const getUserInfo = () =>
  httpClient.get<GetUserSuccAPI>({ uri: '/user', withCredentials: 'access' });

export type AuthProviderState = 'pending' | 'done';
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, setState] = useState<AuthProviderState>('pending');
  const [user, setUser] = useState<AuthContextType['user']>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [isActivated, setIsActivated] = useState<boolean>(false);

  const validateUser = () =>
    getUserInfo()
      .then((res) => {
        console.log('Authenticated');
        setUser(res.data);
        setIsActivated(res.data.activated);
        setIsLoggedIn(true);
        setIsAdmin(res.data.permission === 1);
        return null;
      })
      .catch((err: AxiosError) => {
        console.log(
          'An error occurred while trying to authenticate user:',
          err.message,
        );
        return err;
      });

  const refreshToken = () =>
    httpClient
      .post<RefreshSuccAPI, z.infer<typeof refreshTokenSchema>>({
        uri: '/auth/refresh',
        withCredentials: 'refresh',
        payload: { access_token: getAuthCookie('access')! },
      })
      .then((res) => res.data)
      .catch((err: AxiosError<RefreshFailAPI> | Error) => {
        if (!isAxiosError(err)) {
          console.log('Failed to refresh token:', err.message);
          return;
        }
        return err;
      });

  const fetchUser = useCallback(async () => {
    const validate = await validateUser();

    // Handle validated
    if (!validate) {
      setState('done');
      return;
    }

    // See if fail reason is expired access token
    const castedErr = validate.response?.data as RefreshFailAPI | undefined;
    if (!castedErr || castedErr.errors[0].message !== 'Token is expired!') {
      setState('done');
      return;
    }

    // Handle refreshing token
    const refreshTokenResp = await refreshToken();

    // Non-axios error
    if (!refreshTokenResp) {
      setState('done');
      return;
    }

    // Handle axios error
    if (isAxiosError(refreshTokenResp)) {
      console.log('Failed to refresh token:', refreshTokenResp.message);
      setState('done');
      return;
    }

    // Handle success refresh
    const validateAfterRefresh = await validateUser();

    // Handle non-axios error or validated
    if (!validateAfterRefresh) {
      setState('done');
      return;
    }

    console.log(
      'Failed to authenticate user after refreshing token:',
      validateAfterRefresh.message,
    );
    setState('done');
  }, []);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  return (
    <AuthContext.Provider
      children={children}
      value={{
        state: state,
        user: user,
        isLoggedIn: isLoggedIn,
        isAdmin: isAdmin,
        isActivated: isActivated,
        refetch: fetchUser,
        logout: async () => {
          // Invalidate tokens HTTP
          return await httpClient
            .post({
              uri: '/auth/invalidate-tokens',
              withCredentials: 'refresh',
              payload: { access_token: getAuthCookie('access')! },
            })
            .catch((res) =>
              console.log('Failed to invalidate tokens:', res.message),
            )
            .finally(() => {
              unsetAuthCookie('access');
              unsetAuthCookie('refresh');
            });
        },
        login: (tokens: auth.LoginSuccAPI['data']) => {
          setAuthCookie(tokens.access_token, 'access');
          setAuthCookie(tokens.refresh_token, 'refresh');
        },
      }}
    />
  );
};
