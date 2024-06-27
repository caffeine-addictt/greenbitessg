/**
 * SPDX-FileCopyrightText: 2024 Ng Jun Xiang <contact@ngjx.org>
 *
 * SPDX-License-Identifier: GPL-3.0-only
 */

import * as React from 'react';
import type { PageComponent } from '@pages/route-map';
import { Navigate, useLocation } from 'react-router-dom';

import * as z from 'zod';
import httpClient from '@utils/http';
import { auth } from '@lib/api-types';
import { AuthContext } from '@service/auth';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { activateFormSchema } from '@lib/api-types/schemas/auth';

import { cn } from '@utils/tailwind';
import {
  SymbolIcon,
  CheckCircledIcon,
  CrossCircledIcon,
} from '@radix-ui/react-icons';

// Page
const ActivateWithTokenPage: PageComponent = ({
  className,
  ...props
}): React.JSX.Element => {
  const { isActivated, isAdmin } = React.useContext(AuthContext)!;

  const location = useLocation();
  const queryClient = useQueryClient();

  const tokenOrActivate = location.pathname
    .split('/')
    .at(location.pathname.endsWith('/') ? -2 : -1)!;

  // Handle activate
  const { isFetching, isSuccess, isError } = useQuery(
    {
      queryKey: ['activate'],
      queryFn: () =>
        httpClient.post<
          auth.ActivateSuccAPI,
          z.infer<typeof activateFormSchema>
        >({
          uri: '/auth/activate',
          payload: {
            token: tokenOrActivate,
          },
          withCredentials: 'access',
        }),
      retry: 5,
      retryDelay: (failureCount) => 2 ** failureCount + 10,
      enabled: tokenOrActivate !== 'activate',
    },
    queryClient,
  );

  // Redirect if already activated
  if (isActivated || isSuccess) {
    return (
      <Navigate to={location.state?.from ?? (isAdmin ? '/admin' : '/home')} />
    );
  }

  return (
    <div
      className={cn(className, 'flex-col mx-auto justify-center text-center')}
      {...props}
    >
      {/* Header */}
      <h1 className="mb-4 text-3xl font-bold">Activate your account</h1>

      {/* Sub header */}
      <h3 className="mb-32 text-lg">
        Please check your email for the activation link.
      </h3>

      {/* Statuses */}
      <div
        className={cn('transition-all', {
          hidden: tokenOrActivate === 'activate',
        })}
      >
        {isFetching && (
          <div className="flex flex-row items-center justify-center gap-2">
            <SymbolIcon className="mr-2 size-6 animate-spin" />
            Activating your account... Please wait.
          </div>
        )}

        {isSuccess && (
          <div className="flex flex-row items-center justify-center gap-2">
            <CheckCircledIcon className="mr-2 size-6 animate-none text-green-500" />
            Your account has been activated. Please login.
          </div>
        )}

        {isError && (
          <div className="flex flex-row items-center justify-center gap-2">
            <CrossCircledIcon className="mr-2 size-6 text-red-500" />
            Failed to activate your account. Please try again later.
          </div>
        )}
      </div>

      <div className="h-16 w-4">
        <span className="hidden">Dummy to force main content up a bit</span>
      </div>
    </div>
  );
};
export default ActivateWithTokenPage;
