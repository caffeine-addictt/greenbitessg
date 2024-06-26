/**
 * SPDX-FileCopyrightText: 2024 Ng Jun Xiang <contact@ngjx.org>
 *
 * SPDX-License-Identifier: GPL-3.0-only
 */

import * as z from 'zod';
import { AxiosError, isAxiosError } from 'axios';
import { createContext, useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

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
  login: (tokens: auth.LoginSuccAPI['data']) => void;
  logout: () => void;
};
export const AuthContext = createContext<AuthContextType | null>(null);

/** Try to get user info */
const getUserInfo = () =>
  httpClient.get<GetUserSuccAPI>({ uri: '/user', withCredentials: 'access' });

export type AuthProviderState = 'pending' | 'done';
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();
  const location = useLocation();

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
        setIsAdmin(res.data.permission === 0);
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

  useEffect(() => {
    (async () => {
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
    })();
  }, []);

  return (
    <AuthContext.Provider
      children={children}
      value={{
        state: state,
        user: user,
        isLoggedIn: isLoggedIn,
        isAdmin: isAdmin,
        isActivated: isActivated,
        logout: () => {
          if (!isLoggedIn) navigate('/', { replace: true });

          // Invalidate tokens HTTP
          (async () => {
            await httpClient
              .post({
                uri: '/auth/invalidate-tokens',
                withCredentials: 'refresh',
              })
              .catch((res) =>
                console.log('Failed to invalidate tokens:', res.message),
              );
          })();

          unsetAuthCookie('access');
          unsetAuthCookie('refresh');

          navigate('/', { replace: true });
        },
        login: (tokens: auth.LoginSuccAPI['data']) => {
          setAuthCookie(tokens.access_token, 'access');
          setAuthCookie(tokens.refresh_token, 'refresh');
          navigate(location.state?.from || '/', { replace: true });
        },
      }}
    />
  );
};
