/**
 * SPDX-FileCopyrightText: 2024 Ng Jun Xiang <contact@ngjx.org>
 *
 * SPDX-License-Identifier: GPL-3.0-only
 */

import * as React from 'react';
import { useState } from 'react';
import { cn } from '@utils/tailwind';
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
import { auth, schemas } from '@lib/api-types';
import { useMutation, useQueryClient } from '@tanstack/react-query';

// Page
const RegisterPage: PageComponent = ({
  className,
  ...props
}): React.JSX.Element => {
  const queryClient = useQueryClient();

  const [hidePassword, setHidePassword] = useState<boolean>(true);

  const loginFormSchema = schemas.loginFormSchema;
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
        const response = await httpClient.post<auth.LoginSuccAPI, typeof data>({
          uri: '/auth/login',
          payload: data,
        });
        return response.data;
      },
    },
    queryClient,
  );

  return (
    <div {...props} className={cn(className, 'flex-col pt-10 items-center')}>
      <h1 className="text-3xl font-bold">Login</h1>
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
    </div>
  );
};
export default RegisterPage;
