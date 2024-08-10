/**
 * SPDX-FileCopyrightText: 2024 Ng Jun Xiang <contact@ngjx.org>
 *
 * SPDX-License-Identifier: GPL-3.0-only
 */

import { useState, useContext } from 'react';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, useFormState } from 'react-hook-form';

import httpClient from '@utils/http';
import { AuthContext } from '@service/auth';
import { userUpdateSchema } from '@lib/api-types/schemas/user';
import type { UpdateUserSuccAPI } from '@lib/api-types/user';
import { SuccessResponse } from '@lib/api-types/index';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@components/ui/use-toast';
import { isAxiosError } from 'axios';

import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from '@components/ui/form';
import { Input } from '@components/ui/input';
import { Button } from '@components/ui/button';
import { PageComponent } from '@pages/route-map';
import { useNavigate } from 'react-router-dom';
import { cn } from '@utils/tailwind';

const AccountSettings: PageComponent = ({ className, ...props }) => {
  const { user } = useContext(AuthContext)!;
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const navigate = useNavigate();

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

  // Handle saving account
  const handleSave = async (data: z.infer<typeof userUpdateSchema>) => {
    await httpClient
      .post<UpdateUserSuccAPI, z.infer<typeof userUpdateSchema>>({
        uri: '/user/update',
        payload: data,
        withCredentials: 'access',
      })
      .then(() => {
        setSuccessMessage('Account details updated successfully');
        setError(null);
        window.location.reload();
      })
      .catch((err) => {
        setError('Error updating account details! Please try again later.');
        setSuccessMessage(null);
        console.log(err);
      });
  };

  // Handle deleting account
  const { mutate: deleteUser } = useMutation(
    {
      mutationKey: ['delete-user'],
      mutationFn: () => {
        return httpClient.delete<SuccessResponse<null>>({
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
    <div
      {...props}
      className={cn(
        className,
        'flex flex-col mx-auto py-10 w-[90%] sm:w-4/5 md:w-2/3 lg:w-1/3',
      )}
    >
      <h1 className="mb-10 text-center text-5xl font-bold">My Account</h1>
      <div className="mx-auto my-7 block w-full rounded-md bg-primary-dark p-10 text-lg dark:text-text-light">
        <h4 className="mb-3 flex justify-center font-semibold underline">
          Personal Particulars
        </h4>
        <div className="mx-auto flex justify-center">
          <Form {...accountSettingsForm}>
            <form
              onSubmit={accountSettingsForm.handleSubmit(handleSave)}
              className="mt-8 w-[26.5rem] space-y-4"
            >
              {error && <p className="text-red-500">{error}</p>}
              {successMessage && (
                <p className="text-green-500">{successMessage}</p>
              )}
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
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Saving...' : 'Save'}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
      <div className="my-7 flex w-full justify-center rounded-md bg-primary-dark p-4">
        <Button
          type="button"
          variant="destructive"
          size="default"
          onClick={() => deleteUser()}
        >
          Delete My Account
        </Button>
      </div>
    </div>
  );
};

export default AccountSettings;
