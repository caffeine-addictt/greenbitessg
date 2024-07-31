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
    <div {...props} className="mx-auto mb-7 mt-3 w-full">
      <div className="flex flex-col items-center">
        <h1 className="text-center text-2xl font-bold">My Account</h1>
        <div className="mx-auto my-7 block w-3/5 md:w-4/5 rounded-md bg-primary-dark p-10 text-lg dark:text-text-light">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="text-left">
              <h4 className="mb-3 font-semibold underline">Personal Particulars</h4>
              <div className="mb-3">
                <p className="text-left">
                  Username:{' '}
                  <span className="inline-block w-3/5 md:w-1/2 rounded-md bg-gray-50 px-5 py-1 text-left text-md">
                    {user?.username}
                  </span>
                </p>
              </div>
              <div className="mb-3">
                <p className="text-left">
                  Email:{' '}
                  <span className="inline-block w-4/5 md:w-1/2 rounded-md bg-gray-50 px-5 py-1 text-left text-md">
                    {user?.email}
                  </span>
                </p>
              </div>
            </div>
            <div className="text-left text-md md:ml-14">
              <h4 className="font-semibold underline">Security</h4>
              <p>
                Password:{' '}
                <span className="inline-block w-1/2 rounded-md bg-gray-50 px-5 py-1 text-left">
                  *********
                </span>
              </p>
            </div>
          </div>
          <div className='grid grid-cols-subgrid gap-4 col-span-3'>
            <div className='col-end-3 md:col-end-7'>
              <Button
                variant="secondary"
                size="default"
                className="mt-5 px-5 py-1"
              >
                Edit
              </Button>
            </div>
          </div>
        </div>
        <div className="mx-auto my-7 block w-3/5 md:w-4/5 rounded-md bg-primary-dark p-4">
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
