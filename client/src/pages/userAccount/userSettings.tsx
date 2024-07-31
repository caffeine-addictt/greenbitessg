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
      <div className="flex-col">
        <h1 className=" text-center text-2xl font-bold">My Account</h1>
        <div className="mx-auto my-7 block size-full rounded-md bg-primary-dark p-10 text-lg dark:text-text-light">
          <div className="box-content flex grid-cols-1 justify-between md:grid-cols-2">
            <div className="text-left">
              <h4 className="mb-3 font-semibold underline">
                Personal Particulars
              </h4>
              <div className="grid-cols-2">
                <p className="mb-3 text-right">
                  Username:{' '}
                  <span className="inline-block w-1/2 rounded-md bg-gray-50 px-2 py-1 text-left text-sm">
                    {user?.username}
                  </span>
                </p>
              </div>
              <div className="grid-cols-2">
                <p className="text-right">
                  Email:{' '}
                  <span className="inline-block w-1/2 rounded-md bg-gray-50 px-5 py-1 text-left text-sm">
                    {user?.email}
                  </span>
                </p>
              </div>
            </div>
            <div className="text-left">
              <h4 className="font-semibold underline">Security</h4>
              <p>
                Password:{' '}
                <span className="inline-block w-1/2 rounded-md bg-gray-50 px-5 py-1 text-left">
                  *********
                </span>
              </p>
              <Button
                variant="secondary"
                size="default"
                className="mt-5 px-2 py-1 text-right"
              >
                Edit
              </Button>
            </div>
          </div>
        </div>
        <div className="mx-auto my-7 block w-4/5 rounded-md bg-primary-dark p-4">
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
