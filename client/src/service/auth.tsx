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

  useEffect(() => {
    const access = getAuthCookie('access');
    const refresh = getAuthCookie('refresh');

    if (!access || !refresh) {
      unsetAuthCookie('access');
      unsetAuthCookie('refresh');
      setState('done');
      return;
    }

    // TODO: HTTP validate and refresh token (if needed)

    setIsAdmin(false);
    setIsLoggedIn(false);
    setState('done');
  }, []);

  return (
    <AuthContext.Provider
      children={children}
      value={{
        state: state,
        user: user,
        isLoggedIn: isLoggedIn,
        isAdmin: isAdmin,
        logout: () => {
          if (!isLoggedIn) navigate('/', { replace: true });

          // TODO: Invalidate tokens HTTP

          unsetAuthCookie('access');
          unsetAuthCookie('refresh');

          navigate('/', { replace: true });
        },
        login: (tokens: auth.LoginSuccAPI['data']) => {
          setAuthCookie(tokens.access_token, 'access');
          setAuthCookie(tokens.refresh_token, 'refresh');

          // TODO: HTTP GET user permission level
          setIsLoggedIn(true);
          setIsAdmin(false);
          setState('done');
          navigate(location.state?.from || '/', { replace: true });
        },
      }}
    />
  );
};
