/**
 * SPDX-FileCopyrightText: 2024 Ng Jun Xiang <contact@ngjx.org>
 *
 * SPDX-License-Identifier: GPL-3.0-only
 */

import * as React from 'react';
import AuthLayout from './auth-layout';
import type { PageComponent } from '@pages/route-map';
import {
  Navigate,
  useLocation,
  useNavigate,
  useSearchParams,
} from 'react-router-dom';

import * as z from 'zod';
import httpClient from '@utils/http';
import { auth } from '@lib/api-types';
import { AuthContext } from '@service/auth';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  activateFormSchema,
  recreateTokenSchema,
} from '@lib/api-types/schemas/auth';

import { cn } from '@utils/tailwind';
import {
  SymbolIcon,
  CheckCircledIcon,
  CrossCircledIcon,
} from '@radix-ui/react-icons';
import { AxiosError, isAxiosError } from 'axios';
import { Button } from '@components/ui/button';
import { useToast } from '@components/ui/use-toast';

// Page
const VerifyWithTokenPage: PageComponent = (props): React.JSX.Element => {
  const { toast } = useToast();
  const { isActivated, isAdmin } = React.useContext(AuthContext)!;

  const [params] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const tokenOrActivate = location.pathname
    .split('/')
    .at(location.pathname.endsWith('/') ? -2 : -1)!;

  // Handle verify
  const { isFetching, isSuccess, isError } = useQuery(
    {
      queryKey: ['verify'],
      queryFn: () =>
        httpClient
          .post<auth.ActivateSuccAPI, z.infer<typeof activateFormSchema>>({
            uri: '/auth/activate',
            payload: {
              token: tokenOrActivate,
            },
            withCredentials: 'access',
          })
          .then(() => {
            toast({
              title: 'Account activated',
              description: 'Your account has been activated.',
            });
            navigate(
              params.get('callbackURI') ?? (isAdmin ? '/admin' : '/home'),
            );
          })
          .catch((err: AxiosError) => console.log(err)),
      retry: 5,
      retryDelay: (failureCount) => 2 ** failureCount + 10,
      enabled: tokenOrActivate !== 'verify',
    },
    queryClient,
  );

  // Handle resend token
  const { mutate, isPending } = useMutation(
    {
      mutationKey: ['resend-verification'],
      mutationFn: () =>
        httpClient.post<
          auth.RecreateTokenSuccAPI,
          z.infer<typeof recreateTokenSchema>
        >({
          uri: '/auth/recreate-token',
          withCredentials: 'access',
          payload: {
            token_type: 'verification',
          },
        }),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['verify'] });
        toast({
          title: 'Verification token sent',
          description: 'Please check your email for the verification link.',
        });
      },
      onError: (e: AxiosError | Error) => {
        console.log(e);
        toast({
          title: 'Failed to resend token',
          description: isAxiosError(e)
            ? (e.response?.data as auth.RecreateTokenFailAPI).errors[0].message
            : e.message,
          variant: 'destructive',
        });
      },
    },
    queryClient,
  );

  // Redirect if already activated
  if (isActivated || isSuccess) {
    return (
      <Navigate
        to={params.get('callbackURI') ?? (isAdmin ? '/admin' : '/home')}
      />
    );
  }

  return (
    <AuthLayout
      {...props}
      title="Verify your account"
      subTitle={
        <>
          Please check your email for the verification link.
          <br />
          メールを確認してください
        </>
      }
    >
      <div className="my-auto text-center">
        {/* Header */}
        <h1 className="mb-4 text-3xl font-bold">Activate your account</h1>

        {/* Sub header */}
        <h3 className="mb-32 text-lg">
          Please check your email for the activation link.
        </h3>

        {/* Statuses */}
        <div
          className={cn('transition-all', {
            hidden: tokenOrActivate === 'verify',
          })}
        >
          {isFetching && (
            <div className="flex flex-row items-center justify-center gap-2">
              <SymbolIcon className="mr-2 size-6 animate-spin" />
              Verifying your account... Please wait.
            </div>
          )}

          {isSuccess && (
            <div className="flex flex-row items-center justify-center gap-2">
              <CheckCircledIcon className="mr-2 size-6 animate-none text-green-500" />
              Your account has been verified. Please login.
            </div>
          )}

          {isError && (
            <div className="flex flex-row items-center justify-center gap-2">
              <CrossCircledIcon className="mr-2 size-6 text-red-500" />
              Failed to verify your account. Please try again later.
            </div>
          )}
        </div>

        {/* Resend token */}
        <Button
          type="button"
          onClick={() => mutate()}
          disabled={isFetching || isPending}
          className="mx-auto w-fit"
        >
          {isPending ? 'Resending...' : 'Resend activation token'}
        </Button>

        <div className="h-16 w-4">
          <span className="hidden">Dummy to force main content up a bit</span>
        </div>
      </div>
    </AuthLayout>
  );
};
export default VerifyWithTokenPage;
