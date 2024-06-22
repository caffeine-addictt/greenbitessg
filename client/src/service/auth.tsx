/**
 * SPDX-FileCopyrightText: 2024 Ng Jun Xiang <contact@ngjx.org>
 *
 * SPDX-License-Identifier: GPL-3.0-only
 */

import { auth } from '@lib/api-types';
import { setAuthCookie, unsetAuthCookie, getAuthCookie } from '@utils/jwt';
import { createContext, useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export type AuthContextType = {
  state: AuthProviderState;
  isLoggedIn: boolean;
  isAdmin: boolean;
  login: (tokens: auth.LoginSuccAPI['data']) => void;
  logout: () => void;
};
export const AuthContext = createContext<AuthContextType | null>(null);

export type AuthProviderState = 'pending' | 'done';
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const [state, setState] = useState<AuthProviderState>('pending');
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
