/**
 * SPDX-FileCopyrightText: 2024 Ng Jun Xiang <contact@ngjx.org>
 *
 * SPDX-License-Identifier: GPL-3.0-only
 */

import type { PageComponent } from '@pages/route-map';

import { useContext } from 'react';
import { AuthContext } from '@service/auth';
import { useNavigate } from 'react-router-dom';

import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, useFormState } from 'react-hook-form';

import httpClient, { APIPayload } from '@utils/http';
import { isAxiosError } from 'axios';
import { userUpdateSchema } from '@lib/api-types/schemas/user';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { passkeyRegisterFinishSchema } from '@lib/api-types/schemas/auth';
import type {
  RegisterPasskeysFinishSuccAPI,
  RegisterPasskeysStartSuccAPI,
} from '@lib/api-types/auth';
import type {
  UpdateUserSuccAPI,
  DeleteUserSuccAPI,
  GetPasskeySuccAPI,
  DeletePasskeySuccAPI,
} from '@lib/api-types/user';

import { startRegistration } from '@simplewebauthn/browser';

import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from '@components/ui/form';
import { cn } from '@utils/tailwind';
import { Input } from '@components/ui/input';
import { Button } from '@components/ui/button';
import { useToast } from '@components/ui/use-toast';
import { TrashIcon } from '@radix-ui/react-icons';
import { KeyRoundIcon, LoaderIcon } from 'lucide-react';

const AccountSettingsPage: PageComponent = ({ className, ...props }) => (
  <div
    {...props}
    className={cn(
      className,
      'flex flex-col mx-auto py-10 w-[90%] sm:w-4/5 md:w-2/3 lg:w-1/3',
    )}
  >
    <h1 className="mb-10 text-center text-5xl font-bold">My Account</h1>
    <AccountDetails />
    <AccountDangerActions />
  </div>
);
export default AccountSettingsPage;

// Danger Actions
export const AccountDangerActions = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { toast } = useToast();

  // Handle deleting account
  const { mutate: deleteUser } = useMutation(
    {
      mutationKey: ['delete-user'],
      mutationFn: () => {
        return httpClient.delete<DeleteUserSuccAPI>({
          uri: '/user',
          withCredentials: 'access',
        });
      },
      onError: (err) => {
        console.log(err);
        toast({
          title: 'Something went wrong',
          description: isAxiosError(err)
            ? err.response?.data.errors[0].message
            : 'Please try again later',
          variant: 'destructive',
        });
      },
      onSuccess: () => {
        navigate('/');
      },
    },
    queryClient,
  );

  return (
    <div className="my-7 flex w-full flex-col justify-center gap-5 rounded-md border-2 border-red-400 bg-primary-dark p-4">
      <h2 className="text-3xl font-bold text-red-900">Danger Zone</h2>

      <Button type="button" variant="destructive" onClick={() => deleteUser()}>
        Delete My Account
      </Button>
    </div>
  );
};

// Account Details
export const AccountDetails = () => {
  const queryClient = useQueryClient();

  const { toast } = useToast();
  const { user, refetch } = useContext(AuthContext)!;

  const accountSettingsForm = useForm<z.infer<typeof userUpdateSchema>>({
    resolver: zodResolver(userUpdateSchema),
    defaultValues: {
      username: user?.username,
      email: user?.email,
    },
  });

  const { isSubmitting } = useFormState({
    control: accountSettingsForm.control,
  });

  // Handle updating account
  const { mutate: updateUser } = useMutation(
    {
      mutationKey: ['update-user'],
      mutationFn: (data: z.infer<typeof userUpdateSchema>) =>
        httpClient.post<UpdateUserSuccAPI, z.infer<typeof userUpdateSchema>>({
          uri: '/user/update',
          payload: data,
          withCredentials: 'access',
        }),
      onSuccess: () => {
        toast({
          title: 'Success',
          description: 'Updated account details successfully',
        });
        refetch();
      },
      onError: (err) => {
        console.log(err);
        toast({
          title: 'Something went wrong',
          description: isAxiosError(err)
            ? err.response?.data.errors[0].message
            : 'Please try again later',
          variant: 'destructive',
        });
      },
    },
    queryClient,
  );

  return (
    <div className="mx-auto my-7 block w-full rounded-md bg-primary-dark p-10 text-lg dark:text-text-light">
      <h4 className="mb-3 flex justify-center font-semibold underline">
        Personal Particulars
      </h4>
      <div className="mx-auto flex justify-center">
        <Form {...accountSettingsForm}>
          <form
            onSubmit={accountSettingsForm.handleSubmit((data) =>
              updateUser(data),
            )}
            className="mt-8 w-[26.5rem] space-y-4"
          >
            <FormField
              control={accountSettingsForm.control}
              name="username"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Username"
                      className={fieldState.error ? 'border-red-700' : ''}
                      {...field}
                    />
                  </FormControl>
                  {fieldState.error ? (
                    <FormMessage>{fieldState.error.message}</FormMessage>
                  ) : (
                    <FormDescription>Your account username.</FormDescription>
                  )}
                </FormItem>
              )}
            />
            <FormField
              control={accountSettingsForm.control}
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
                    <FormMessage>{fieldState.error.message}</FormMessage>
                  ) : (
                    <FormDescription>Your email address.</FormDescription>
                  )}
                </FormItem>
              )}
            />
            <div className="flex justify-center space-x-2 md:justify-end">
              <Button
                type="reset"
                variant="ghost"
                disabled={
                  isSubmitting || !accountSettingsForm.formState.isDirty
                }
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="secondary"
                disabled={
                  isSubmitting ||
                  (user?.username ===
                    accountSettingsForm.getValues('username') &&
                    user?.email === accountSettingsForm.getValues('email'))
                }
              >
                {isSubmitting ? 'Saving...' : 'Save'}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};
