/**
 * SPDX-FileCopyrightText: 2024 Ng Jun Xiang <contact@ngjx.org>
 *
 * SPDX-License-Identifier: GPL-3.0-only
 */

import { useContext } from 'react';
import AuthLayout from './auth-layout';
import { AuthContext } from '@service/auth';
import type { PageComponent } from '@pages/route-map';

import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, useFormState } from 'react-hook-form';

import { startAuthentication } from '@simplewebauthn/browser';

import { AxiosError, isAxiosError } from 'axios';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import httpClient from '@utils/http';
import { auth, schemas } from '@lib/api-types';

import {
  Form,
  FormDescription,
  FormField,
  FormLabel,
  FormItem,
  FormControl,
  FormMessage,
} from '@components/ui/form';
import { Input } from '@components/ui/input';
import { Button } from '@components/ui/button';
import { useToast } from '@components/ui/use-toast';
import { KeyRoundIcon, LoaderIcon } from 'lucide-react';

export const PasskeyLoginPage: PageComponent = (props) => {
  const queryClient = useQueryClient();

  const { toast } = useToast();
  const { login } = useContext(AuthContext)!;

  const loginForm = useForm<z.infer<typeof schemas.auth.passkeyLoginSchema>>({
    resolver: zodResolver(schemas.auth.passkeyLoginSchema),
    defaultValues: {
      email: '',
    },
  });
  const { isSubmitting } = useFormState({ control: loginForm.control });

  const { mutate: loginPasskey } = useMutation(
    {
      mutationFn: async (
        data: z.infer<typeof schemas.auth.passkeyLoginSchema>,
      ) => {
        const resp = await httpClient
          .post<
            auth.LoginPasskeysStartSuccAPI,
            z.infer<typeof schemas.auth.passkeyLoginSchema>
          >({
            uri: '/auth/login/passkeys/start',
            payload: data,
          })
          .then((res) => res.data)
          .catch((err: AxiosError | Error) => {
            toast({
              title: 'Login failed',
              description: isAxiosError(err)
                ? (err.response?.data as auth.LoginPasskeysStartFailAPI)
                    .errors[0].message
                : err.message,
              variant: 'destructive',
            });
            console.error(err);
          });
        if (!resp) return false;

        let authResp;
        try {
          authResp = await startAuthentication(resp.challenge);
        } catch (err) {
          console.error('Failed to login with passkey:', err);
          toast({
            title: 'Login failed',
            description: 'Something went wrong while authenticating.',
            variant: 'destructive',
          });
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
          .catch((err: AxiosError | Error) => {
            toast({
              title: 'Login failed',
              description: isAxiosError(err)
                ? (err.response?.data as auth.LoginPasskeysStartFailAPI)
                    .errors[0].message
                : err.message,
              variant: 'destructive',
            });
            console.error(err);
          });
        if (!verifyResp) return false;

        console.log('Successfully logged in with passkey:');
        login(verifyResp);
        toast({
          title: 'Logged in',
          description: 'Welcome back.',
        });

        window.location.reload();
      },
    },
    queryClient,
  );

  return (
    <AuthLayout {...props} title="Login with passkey" subTitle="Welcome back!">
      <Form {...loginForm}>
        <form
          onSubmit={loginForm.handleSubmit((data) => loginPasskey(data))}
          className="my-auto w-96 space-y-4 max-sm:w-[90%] max-sm:min-w-56 max-sm:max-w-96"
        >
          <FormField
            control={loginForm.control}
            name="email"
            render={({ field, fieldState }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="johndoe@example.com"
                    className={fieldState.error ? 'border-red-700' : ''}
                    {...field}
                  />
                </FormControl>
                {fieldState.error ? (
                  <FormMessage />
                ) : (
                  <FormDescription>Your email address.</FormDescription>
                )}
              </FormItem>
            )}
          />
          <div className="flex justify-center">
            <Button
              type="submit"
              className="w-96 max-sm:w-[90%] max-sm:min-w-56 max-sm:max-w-96"
              disabled={isSubmitting}
            >
              {!isSubmitting ? (
                <>
                  <KeyRoundIcon className="mr-2 size-6" />
                  Log in with passkeys
                </>
              ) : (
                <>
                  <LoaderIcon className="mr-2 size-4 animate-spin" />
                  Logging in...
                </>
              )}
            </Button>
          </div>
        </form>
      </Form>
    </AuthLayout>
  );
};
