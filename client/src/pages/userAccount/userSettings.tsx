/**
 * SPDX-FileCopyrightText: 2024 Ng Jun Xiang <contact@ngjx.org>
 *
 * SPDX-License-Identifier: GPL-3.0-only
 */

import * as React from 'react';
import { AuthContext } from '@service/auth';
import type { PageComponent } from '@pages/route-map';
import { Button } from '@components/ui/button';

import httpClient, { APIPayload } from '@utils/http';
import { SuccessResponse } from '@lib/api-types/index';
import { useQuery, useQueryClient } from '@tanstack/react-query';

const SettingPage: PageComponent = (props) => {
  const { user } = React.useContext(AuthContext)!;
  const queryClient = useQueryClient();

  // handle delete user
  const { refetch: deleteUser } = useQuery(
    {
      queryKey: ['delete-user'],
      queryFn: () => {
        return httpClient.post<SuccessResponse<null>, APIPayload>({
          uri: '/user/deleteUser',
          withCredentials: 'access',
        });
      },
      enabled: false,
    },
    queryClient,
  );

  return (
    <div {...props} className="mx-auto mb-7 mt-3">
      <div className="flex-col">
        <h1 className=" text-center text-2xl font-bold">My Account</h1>
        <div className="mx-auto my-7 block max-w-3xl rounded-md bg-primary-dark p-4 text-lg dark:text-text-light">
          <div className="flex justify-between">
            <div className="w-1/2 text-left">
              <h4 className="font-semibold underline">Personal Particulars</h4>
              <p>Username: {user?.username}</p>
              <p>Email: {user?.email}</p>
            </div>
            <div className="w-1/2 text-right">
              <h4 className="font-semibold underline">Security</h4>
              <p>Password:</p>
              <Button variant="secondary" size="default">
                Edit
              </Button>
            </div>
          </div>
        </div>
        <div className="mx-auto my-7 block max-w-3xl rounded-md bg-primary-dark p-4">
          <a href="/" className="flex justify-center">
            <Button
              type="submit"
              variant="destructive"
              size="default"
              onClick={() => deleteUser()}
            >
              Delete My Account
            </Button>
          </a>
        </div>
      </div>
    </div>
  );
};
export default SettingPage;
