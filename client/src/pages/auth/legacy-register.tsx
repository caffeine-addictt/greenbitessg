/**
 * SPDX-FileCopyrightText: 2024 Ng Jun Xiang <contact@ngjx.org>
 *
 * SPDX-License-Identifier: GPL-3.0-only
 */

import * as React from 'react';
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
import { Switch } from '@components/ui/switch';
import { Button } from '@components/ui/button';
import { LoaderIcon } from 'lucide-react';
import { EnvelopeClosedIcon } from '@radix-ui/react-icons';

import httpClient from '@utils/http';
import { auth, schemas } from '@lib/api-types';
import { AxiosError, isAxiosError } from 'axios';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import AuthLayout from './auth-layout';
import { useToast } from '@components/ui/use-toast';
import { useNavigate, useSearchParams } from 'react-router-dom';

// Page
const RegisterPage: PageComponent = (props): React.JSX.Element => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { toast } = useToast();
  const [url] = useSearchParams();

  const registerFormSchema = schemas.auth.registerFormSchema
    .extend({
      confirm: z
        .string({
          invalid_type_error: 'Please retype your password!',
          required_error: 'Please retype your password!',
        })
        .min(1, { message: 'Please retype your password!' }),
      agreePolicy: z.boolean().refine((val) => val === true, {
        message: 'Please agree to our Terms of Service!',
      }),
    })
    .refine((data) => data.password === data.confirm, {
      message: 'Passwords do not match!',
      path: ['confirm'],
    });

  const registerForm = useForm<z.infer<typeof registerFormSchema>>({
    resolver: zodResolver(registerFormSchema),
    defaultValues: {
      username: '',
      email: '',
      password: '',
      confirm: '',
      agreePolicy: false,
    },
  });
  const { isSubmitting } = useFormState({ control: registerForm.control });

  // Handling submiting
  const { mutate: createAccount } = useMutation(
    {
      mutationFn: async (data: z.infer<typeof registerFormSchema>) => {
        await httpClient
          .post<auth.RegisterSuccAPI, typeof data>({
            uri: '/auth/register',
            payload: data,
          })
          .then(() => {
            toast({
              title: 'Registered account successfully',
              description: 'Check your email for the account activation link',
            });

            navigate(
              `/activate?callbackURI=${url.get('callbackURI') || '/home'}`,
            );
          })
          .catch((e: AxiosError | Error) => {
            console.log(e);
            toast({
              title: 'Failed to register account',
              description: isAxiosError(e)
                ? (e.response?.data as auth.RegisterFailAPI).errors[0].message
                : e.message,
              variant: 'destructive',
            });
          });
      },
    },
    queryClient,
  );

  return (
    <AuthLayout
      {...props}
      title="Register with email"
      subTitle="Create a new account with us!"
    >
      <Form {...registerForm}>
        <form
          onSubmit={registerForm.handleSubmit((data) => createAccount(data))}
          className="my-auto w-96 space-y-4 max-sm:w-[90%] max-sm:min-w-56 max-sm:max-w-96"
        >
          <FormField
            control={registerForm.control}
            name="username"
            render={({ field, fieldState }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input
                    placeholder="John Doe"
                    className={fieldState.error ? 'border-red-700' : ''}
                    {...field}
                  />
                </FormControl>
                {fieldState.error ? (
                  <FormMessage />
                ) : (
                  <FormDescription>Your account username.</FormDescription>
                )}
              </FormItem>
            )}
          />
          <FormField
            control={registerForm.control}
            name="email"
            render={({ field, fieldState }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
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
            control={registerForm.control}
            name="password"
            render={({ field, fieldState }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Your password"
                    type="password"
                    className={fieldState.error ? 'border-red-700' : ''}
                    {...field}
                  />
                </FormControl>
                {fieldState.error ? (
                  <FormMessage />
                ) : (
                  <FormDescription>Your account password.</FormDescription>
                )}
              </FormItem>
            )}
          />
          <FormField
            control={registerForm.control}
            name="confirm"
            render={({ field, fieldState }) => (
              <FormItem>
                <FormLabel>Confirm Your Password</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Retype your password"
                    type="password"
                    className={fieldState.error ? 'border-red-700' : ''}
                    {...field}
                  />
                </FormControl>
                {fieldState.error ? (
                  <FormMessage className="h-5" />
                ) : (
                  <FormDescription>Retype your password.</FormDescription>
                )}
              </FormItem>
            )}
          />
          <div className="space-y-2 pt-4">
            <FormField
              control={registerForm.control}
              name="agreePolicy"
              render={({ field, fieldState }) => (
                <FormItem
                  className={cn(
                    'flex flex-row items-center justify-between gap-4 rounded-lg border p-3 shadow-sm',
                    { 'border-red-700': fieldState.error },
                  )}
                >
                  <div className="space-y-0.5">
                    <FormLabel>
                      Agree to our terms of service{' '}
                      <span className="text-red-700">*</span>
                    </FormLabel>
                    <FormDescription>
                      Learn more about our <a href="">Terms of Service</a>.
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
          <div className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="ghost"
              onClick={() => registerForm.reset()}
              disabled={isSubmitting || !registerForm.formState.isDirty}
            >
              Clear
            </Button>
            <Button type="submit" variant="default" disabled={isSubmitting}>
              {!isSubmitting ? (
                <>
                  <EnvelopeClosedIcon className="mr-2 size-6" />
                  Register
                </>
              ) : (
                <>
                  <LoaderIcon className="mr-2 size-4 animate-spin" />
                  Registering...
                </>
              )}
            </Button>
          </div>
        </form>
      </Form>
    </AuthLayout>
  );
};
export default RegisterPage;
