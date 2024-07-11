/**
 * SPDX-FileCopyrightText: 2024 Ng Jun Xiang <contact@ngjx.org>
 *
 * SPDX-License-Identifier: GPL-3.0-only
 */

import { useContext, useState } from 'react';

import * as z from 'zod';

import {
  startAuthentication,
  startRegistration,
} from '@simplewebauthn/browser';

import { AxiosError } from 'axios';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import httpClient, { APIPayload } from '@utils/http';
import { auth, schemas } from '@lib/api-types';

import { Input } from '@components/ui/input';
import { Button } from '@components/ui/button';
import type { PageComponent } from '@pages/route-map';
import { AuthContext } from '@service/auth';

export const PasskeyRegisterPage: PageComponent = ({ className, ...props }) => {
  const queryClient = useQueryClient();

  const { refetch } = useQuery(
    {
      queryKey: ['register-passkey'],
      queryFn: async () => {
        const resp = await httpClient
          .post<auth.RegisterPasskeysStartSuccAPI, APIPayload>({
            uri: '/auth/register/passkeys/start',
            withCredentials: 'access',
          })
          .then((res) => res.data)
          .catch((err: AxiosError) => console.error(err));

        if (!resp) return false;

        let authResp;
        try {
          authResp = await startRegistration(resp.challenge);
        } catch (err) {
          console.error('Failed to register passkey:', err);
          return false;
        }

        // Verify passkey
        const verifyResp = await httpClient
          .post<
            auth.RegisterPasskeysFinishSuccAPI,
            schemas.auth.passkeyRegisterFinishSchema
          >({
            uri: '/auth/register/passkeys/finish',
            withCredentials: 'access',
            payload: {
              track: resp.track,
              signed: authResp,
            },
          })
          .then((res) => res.data)
          .catch((err: AxiosError) => console.error(err));

        if (!verifyResp) return false;
        console.log('Successfully registered passkey:', verifyResp);
        return true;
      },
      enabled: false,
    },
    queryClient,
  );

  return (
    <div className={className} {...props}>
      <Button onClick={() => refetch()}>Test register passkey</Button>
    </div>
  );
};

export const PasskeyLoginPage: PageComponent = ({ className, ...props }) => {
  const queryClient = useQueryClient();
  const { login } = useContext(AuthContext)!;
  const [email, setEmail] = useState('');

  const { refetch } = useQuery(
    {
      queryKey: ['login-passkey'],
      queryFn: async () => {
        const resp = await httpClient
          .post<
            auth.LoginPasskeysStartSuccAPI,
            z.infer<typeof schemas.auth.passkeyLoginSchema>
          >({
            uri: '/auth/login/passkeys/start',
            payload: {
              email: email,
            },
          })
          .then((res) => res.data)
          .catch((err: AxiosError) => console.error(err));

        if (!resp) return false;

        let authResp;
        try {
          authResp = await startAuthentication(resp.challenge);
        } catch (err) {
          console.error('Failed to login with passkey:', err);
          return false;
        }

        // Verify passkey
        const verifyResp = await httpClient
          .post<
            auth.LoginPasskeysFinishSuccAPI,
            schemas.auth.passkeyLoginFinishSchema
          >({
            uri: '/auth/login/passkeys/finish',
            payload: {
              track: resp.track,
              signed: authResp,
            },
          })
          .then((res) => res.data)
          .catch((err: AxiosError) => console.error(err));

        if (!verifyResp) return false;
        console.log('Successfully registered passkey:');

        login(verifyResp);
        window.location.reload();
      },
      enabled: false,
    },
    queryClient,
  );

  return (
    <div className={className} {...props}>
      <Button onClick={() => refetch()}>Test login passkey</Button>
      <Input
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
    </div>
  );
};
