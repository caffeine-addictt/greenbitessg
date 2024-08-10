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
    <AccountPasskeys />
    <AccountDangerActions />
  </div>
);
export default AccountSettingsPage;

// Passkeys
export const AccountPasskeys = () => {
  const queryClient = useQueryClient();

  const { toast } = useToast();

  // Fetch passkeys
  const { data, refetch, isFetching } = useQuery(
    {
      queryKey: ['fetch-passkeys'],
      queryFn: () =>
        httpClient
          .get<GetPasskeySuccAPI>({
            uri: '/user/passkey',
            withCredentials: 'access',
          })
          .then((res) => res.data)
          .catch((err) => {
            console.log(err);
            toast({
              title: 'Something went wrong fetching passkeys',
              description: isAxiosError(err)
                ? err.response?.data.errors[0].message
                : 'Please try again later',
              variant: 'destructive',
            });
            return [];
          }),
    },
    queryClient,
  );

  // Delete passkey
  const { mutate: deletePasskey, isPending: isDeleting } = useMutation(
    {
      mutationKey: ['delete-passkey'],
      mutationFn: (id: number) =>
        httpClient.delete<DeletePasskeySuccAPI>({
          uri: `/user/passkey/${id}`,
          withCredentials: 'access',
        }),
      onSuccess: () => {
        toast({
          title: 'Passkey deleted',
          description: 'Passkey deleted successfully',
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

  // Finish passkey registration
  const { mutate: finishRegistrationFlow, isPending: isRegisteringFinish } =
    useMutation(
      {
        mutationKey: ['finish-registration'],
        mutationFn: (data: passkeyRegisterFinishSchema) => {
          toast({
            title: 'Registering passkey...',
            description: 'Please wait, this may take a few seconds',
          });
          return httpClient.post<
            RegisterPasskeysFinishSuccAPI,
            passkeyRegisterFinishSchema
          >({
            uri: '/auth/register/passkeys/finish',
            withCredentials: 'access',
            payload: data,
          });
        },
        onSuccess: () => {
          toast({
            title: 'Passkey registered',
            description: 'Passkey registered successfully',
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

  // Start passkey registration
  const { mutate: startRegistrationFlow, isPending: isRegisteringStart } =
    useMutation(
      {
        mutationKey: ['start-registration'],
        mutationFn: async () => {
          toast({
            title: 'Firing up our servers...',
            description: 'Please wait, this may take a few seconds',
          });
          const res = await httpClient.post<
            RegisterPasskeysStartSuccAPI,
            APIPayload
          >({
            uri: '/auth/register/passkeys/start',
            withCredentials: 'access',
          });
          return res.data;
        },
        onSuccess: (data) =>
          startRegistration(data.challenge)
            .then((authResp) => {
              finishRegistrationFlow({
                track: data.track,
                signed: authResp,
              });
            })
            .catch((err) => {
              console.error('Failed to start passkey:', err);
              toast({
                title: 'Something went wrong',
                description: 'Please try again later',
                variant: 'destructive',
              });
            }),
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
    <div className="my-7 flex w-full flex-col justify-center gap-2 rounded-md border-2 border-secondary-light bg-primary-dark p-4">
      <h2 className="mb-5 text-3xl font-bold text-text-dark dark:text-text-light">
        Passkeys
      </h2>

      {isFetching && (
        <div className="mx-auto flex flex-row text-center">
          <LoaderIcon className="mr-2 size-6 animate-spin" />
          Loading...
        </div>
      )}

      {data &&
        data.map((p, i) => (
          <div
            key={`passkey-${i}`}
            className="flex w-full items-center justify-between rounded-md bg-secondary-light p-4 text-sm text-text-light dark:text-text-light"
          >
            <div className="flex w-1/3 flex-col">
              <p>Device Type: {p.device_type}</p>
              <p>Used {p.counter} times</p>
            </div>

            <div className="flex w-1/3 flex-col">
              <p>Created: {new Date(p.created_at).toLocaleDateString()}</p>
              <p>Updated: {new Date(p.updated_at).toLocaleDateString()}</p>
            </div>

            <Button
              size="icon"
              variant="ghost"
              className="ml-auto"
              disabled={isDeleting}
              onClick={() => deletePasskey(p.id)}
            >
              <TrashIcon className="size-6 text-red-600" />
            </Button>
          </div>
        ))}

      <Button
        type="button"
        disabled={isRegisteringStart || isRegisteringFinish}
        onClick={() => startRegistrationFlow()}
      >
        <KeyRoundIcon className="mr-2 size-6" />
        Register a new passkey
      </Button>
    </div>
  );
};

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
