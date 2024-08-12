/**
 * SPDX-FileCopyrightText: 2024 Ng Jun Xiang <contact@ngjx.org>
 *
 * SPDX-License-Identifier: GPL-3.0-only
 */

import * as z from 'zod';
import { createContext, useState } from 'react';

import httpClient from '@utils/http';
import { type AxiosError, isAxiosError } from 'axios';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import { auth } from '@lib/api-types';
import { userType } from '@lib/api-types/schemas/user';
import type { GetUserSuccAPI } from '@lib/api-types/user';
import type { RefreshFailAPI, RefreshSuccAPI } from '@lib/api-types/auth';
import { getAuthCookie, setAuthCookie, unsetAuthCookie } from '@utils/jwt';
import { refreshTokenSchema } from '@lib/api-types/schemas/auth';

export type AuthContextType = {
  state: AuthProviderState;
  user: z.infer<typeof userType> | null;
  isLoggedIn: boolean;
  isAdmin: boolean;
  isActivated: boolean;
  refetch: () => Promise<unknown>;
  login: (tokens: auth.LoginSuccAPI['data']) => void;
  logout: () => Promise<unknown>;
};
export const AuthContext = createContext<AuthContextType | null>(null);

export type AuthProviderState = 'pending' | 'done';
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const queryClient = useQueryClient();
  const [state, setState] = useState<AuthProviderState>('pending');
  const [user, setUser] = useState<z.infer<typeof userType> | null>(null);

  // Login functionality
  const login = (tokens: auth.LoginSuccAPI['data']) => {
    setAuthCookie(tokens.access_token, 'access');
    setAuthCookie(tokens.refresh_token, 'refresh');
  };

  // Logout functionality
  const { mutateAsync: logout } = useMutation(
    {
      mutationKey: ['user-logout'],
      mutationFn: () =>
        httpClient.post({
          uri: '/auth/invalidate-tokens',
          withCredentials: 'refresh',
          payload: { access_token: getAuthCookie('access')! },
        }),
      onError: (err) => console.log('Failed to logout:', err.message),
      onSettled: () => {
        // Invalidate queries
        queryClient.invalidateQueries({ queryKey: ['user'] });
        queryClient.invalidateQueries({ queryKey: ['user-logout'] });
        queryClient.invalidateQueries({ queryKey: ['user-refresh'] });

        // Unset token
        unsetAuthCookie('access');
        unsetAuthCookie('refresh');

        // Update state
        setUser(null);
      },
    },
    queryClient,
  );

  // Refreshing user token
  const { mutate: refreshToken } = useMutation(
    {
      mutationKey: ['user-refresh'],
      mutationFn: () =>
        httpClient
          .post<RefreshSuccAPI, z.infer<typeof refreshTokenSchema>>({
            uri: '/auth/refresh',
            withCredentials: 'refresh',
            payload: { access_token: getAuthCookie('access')! },
          })
          .then((res) => res.data),
      onSuccess: (data) => {
        login(data);
        queryClient.invalidateQueries({ queryKey: ['user'] });
        return fetchUser();
      },
      onError: (err: AxiosError<RefreshFailAPI> | Error) => {
        setState('done');
        if (!isAxiosError(err)) {
          console.log('Failed to refresh token:', err.message);
          return;
        }
        console.log(
          'Failed to refresh token:',
          err.response?.data.errors[0].message,
        );
      },
    },
    queryClient,
  );

  // Fetching user
  const { refetch: fetchUser } = useQuery(
    {
      queryKey: ['user'],
      queryFn: () =>
        httpClient
          .get<GetUserSuccAPI>({ uri: '/user', withCredentials: 'access' })
          .then((res) => res.data)
          .then((data) => {
            console.log('Authenticated');
            setUser(data);
            setState('done');
            return data;
          })
          .catch((err: AxiosError) => {
            console.log(
              'An error occurred while trying to authenticate user:',
              err.message,
            );

            // See if fail reason is expired access token
            const castedErr = err.response?.data as RefreshFailAPI | undefined;
            if (
              !castedErr ||
              (castedErr.errors[0].message !== 'Token is expired!' &&
                castedErr.errors[0].message !== 'Invalid token!')
            ) {
              setState('done');
              throw err;
            }

            // Try to refresh token
            queryClient.invalidateQueries({ queryKey: ['user-refresh'] });
            refreshToken();
            throw err;
          }),
    },
    queryClient,
  );

  return (
    <AuthContext.Provider
      children={children}
      value={{
        state: state,
        user: user || null,
        isLoggedIn: !!user,
        isAdmin: user?.permission === 0 || false,
        isActivated: user?.activated || false,
        refetch: () => fetchUser(),
        logout: logout,
        login: login,
      }}
    />
  );
};
