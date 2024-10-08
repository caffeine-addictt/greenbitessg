/**
 * SPDX-FileCopyrightText: 2024 Ng Jun Xiang <contact@ngjx.org>
 *
 * SPDX-License-Identifier: GPL-3.0-only
 */

import * as React from 'react';
import { useState } from 'react';
import { AxiosError, isAxiosError } from 'axios';
import { Navigate, useSearchParams } from 'react-router-dom';
import type { PageComponent } from '@pages/route-map';

import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, useFormState } from 'react-hook-form';

import {
  Form,
  FormDescription,
  FormField,
  FormLabel,
  FormItem,
  FormControl,
  FormMessage,
} from '@components/ui/form';
import { LoaderIcon } from 'lucide-react';
import { Input } from '@components/ui/input';
import { Button } from '@components/ui/button';
import {
  EyeNoneIcon,
  EyeClosedIcon,
  EnvelopeClosedIcon,
} from '@radix-ui/react-icons';

import httpClient from '@utils/http';
import { auth } from '@lib/api-types';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import AuthLayout from './auth-layout';
import { AuthContext } from '@service/auth';
import { loginFormSchema } from '@lib/api-types/schemas/auth';
import { useToast } from '@components/ui/use-toast';

// Page
const LoginPage: PageComponent = (props): React.JSX.Element => {
  const queryClient = useQueryClient();
  const [params] = useSearchParams();
  const { isLoggedIn, isAdmin, login } = React.useContext(AuthContext)!;

  const { toast } = useToast();
  const [hidePassword, setHidePassword] = useState<boolean>(true);

  const loginForm = useForm<z.infer<typeof loginFormSchema>>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });
  const { isSubmitting } = useFormState({ control: loginForm.control });

  // Handle email-password login
  const { mutate: passwordLogin } = useMutation(
    {
      mutationFn: async (data: z.infer<typeof loginFormSchema>) => {
        await httpClient
          .post<auth.LoginSuccAPI, typeof data>({
            uri: '/auth/login',
            payload: data,
          })
          .then((r) => {
            login(r.data);
            toast({
              title: 'Logged in',
              description: 'Welcome back.',
            });

            window.location.reload();
          })
          .catch((e: AxiosError | Error) => {
            console.log(e);
            toast({
              title: 'Failed to login',
              description: isAxiosError(e)
                ? (e.response?.data as auth.LoginFailAPI).errors[0].message
                : e.message,
              variant: 'destructive',
            });
          });
      },
    },
    queryClient,
  );

  // Redirect if already logged in
  if (isLoggedIn) {
    return (
      <Navigate
        to={params.get('callbackURI') || (isAdmin ? '/admin' : '/home')}
        replace
      />
    );
  }

  return (
    <AuthLayout
      {...props}
      title="Login with email"
      subTitle="Enter your email and password to login."
    >
      <Form {...loginForm}>
        <form
          onSubmit={loginForm.handleSubmit((data) => passwordLogin(data))}
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
          <FormField
            control={loginForm.control}
            name="password"
            render={({ field, fieldState }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <div className="relative">
                  <FormControl>
                    <Input
                      type={hidePassword ? 'password' : 'text'}
                      placeholder="***"
                      className={
                        fieldState.error ? 'z-0 border-red-700' : 'z-0'
                      }
                      {...field}
                    />
                  </FormControl>
                  <Button
                    type="button"
                    variant="ghost"
                    className="absolute right-1 top-1/2 z-10 size-fit -translate-y-1/2 p-2"
                    onClick={() => setHidePassword(!hidePassword)}
                  >
                    {!hidePassword ? (
                      <EyeClosedIcon className="size-4" />
                    ) : (
                      <EyeNoneIcon className="size-4" />
                    )}
                  </Button>
                </div>
                {fieldState.error ? (
                  <FormMessage />
                ) : (
                  <FormDescription>Your password.</FormDescription>
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
                  <EnvelopeClosedIcon className="mr-2 size-6" />
                  Log in with email
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
export default LoginPage;
