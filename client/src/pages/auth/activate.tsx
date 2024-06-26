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

// Page
const ActivateWithTokenPage: PageComponent = ({
  className,
  ...props
}): React.JSX.Element => {
  const { isActivated, ...authStuff } = React.useContext(AuthContext)!;

  const location = useLocation();
  const queryClient = useQueryClient();

  // Handle activate
  const { refetch, isFetching, isSuccess, isError } = useQuery(
    {
      queryKey: ['activate'],
      queryFn: () =>
        httpClient.post<
          auth.ActivateSuccAPI,
          z.infer<typeof activateFormSchema>
        >({
          uri: '/auth/activate',
          payload: {
            token: location.pathname.split('/').at(-1)!,
          },
          withCredentials: 'access',
        }),
      retry: 5,
      retryDelay: (failureCount) => 2 ** failureCount + 10,
    },
    queryClient,
  );

  // Redirect if already activated
  if (isActivated || isSuccess) {
    console.log(authStuff);
    return <Navigate to={location.state?.from ?? '/home'} />;
  }

  return (
    <div className={className} {...props}>
      {isFetching && 'Activating your account. Please wait.'}
      {isSuccess && 'Your account has been activated. Please login.'}
      {isError && 'Failed to activate your account. Please try again later.'}
      <button onClick={() => refetch()}>refetch</button>
    </div>
  );
};
export default ActivateWithTokenPage;
