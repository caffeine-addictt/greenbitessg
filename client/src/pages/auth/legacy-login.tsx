/**
 * SPDX-FileCopyrightText: 2024 Ng Jun Xiang <contact@ngjx.org>
 *
 * SPDX-License-Identifier: GPL-3.0-only
 */

import * as React from 'react';
import { useState } from 'react';
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
import { Input } from '@components/ui/input';
import { Button } from '@components/ui/button';
import { EyeNoneIcon, EyeClosedIcon } from '@radix-ui/react-icons';

import httpClient from '@utils/http';
import { auth } from '@lib/api-types';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AuthContext } from '@service/auth';
import { Navigate, useLocation } from 'react-router-dom';
import { loginFormSchema } from '@lib/api-types/schemas/auth';
import AuthLayout from './auth-layout';

// Page
const LoginPage: PageComponent = (props): React.JSX.Element => {
  const queryClient = useQueryClient();
  const location = useLocation();
  const { isLoggedIn, isAdmin, login } = React.useContext(AuthContext)!;

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
          .then((r) => login(r.data))
          .catch((e) => console.log(e));
      },
    },
    queryClient,
  );

  // Redirect if already logged in
  if (isLoggedIn) {
    return (
      <Navigate
        to={location.state?.from || (isAdmin ? '/admin' : '/home')}
        replace
      />
    );
  }

  return (
    <AuthLayout {...props}>
      <h1 className="mb-10 text-3xl font-bold">Login</h1>
      <Form {...loginForm}>
        <form
          onSubmit={loginForm.handleSubmit((data) => passwordLogin(data))}
          className="w-[26.5rem] space-y-4"
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
              variant="secondary"
              className="w-40"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Logging in...' : 'Log in'}
            </Button>
          </div>
        </form>
      </Form>
    </AuthLayout>
  );
};
export default LoginPage;