import { useState, useEffect } from 'react';
import { useForm, useFormState } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { userType } from '@lib/api-types/schemas/user';
import httpClient from '@utils/http';
import { getAuthCookie } from '@utils/jwt';

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
import { cn } from '@utils/tailwind';

const AccountSettings: React.FC<{ className?: string }> = ({
  className,
  ...props
}) => {
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const accountSettingsForm = useForm<z.infer<typeof userType>>({
    resolver: zodResolver(userType),
    defaultValues: {
      username: '',
      email: '',
    },
  });

  const { isSubmitting } = useFormState({
    control: accountSettingsForm.control,
  });

  useEffect(() => {
    const fetchAccountSettings = async () => {
      const token = getAuthCookie('access');
      if (!token) {
        setError('No authentication token found');
        return;
      }

      try {
        const response = await httpClient.get<{
          status: number;
          data: {
            id: string;
            username: string;
            email: string;
            permission: string;
            activated: boolean;
            createdAt: string;
            updatedAt: string;
          };
        }>({
          uri: '/user',
          options: {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        });

        const { data } = response;

        if (data.username && data.email) {
          accountSettingsForm.setValue('username', data.username);
          accountSettingsForm.setValue('email', data.email);
        } else {
          setError('Invalid data received from the server');
        }
      } catch (err) {
        console.error('Error fetching account settings:', err);
        setError('Error fetching account settings');
      }
    };

    fetchAccountSettings();
  }, [accountSettingsForm]);

  const handleSave = async (data: z.infer<typeof userType>) => {
    const token = getAuthCookie('access');
    if (!token) {
      setError('No authentication token found');
      return;
    }

    try {
      const response = await httpClient.put<
        {
          status: number;
          data: {
            id: string;
            username: string;
            email: string;
            permission: string;
            createdAt: string;
            updatedAt: string;
          };
        },
        { username: string; email: string }
      >({
        uri: '/user',
        payload: data,
        options: {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        },
      });

      console.log('Update response:', response);
      setSuccessMessage('Account details updated successfully');
      setError(null);
    } catch (error) {
      console.error('Error updating account details:', error);
      setError('Error updating account details');
      setSuccessMessage(null);
    }
  };

  const handleCancel = () => {
    console.log('Cancelled');
    alert('Edit cancelled');
  };

  return (
    <div {...props} className={cn(className, 'container mx-auto mt-16')}>
      <h1 className="text-center text-2xl font-bold">Account Settings</h1>
      <Form {...accountSettingsForm}>
        <form
          onSubmit={accountSettingsForm.handleSubmit(handleSave)}
          className="mt-8 w-[26.5rem] space-y-4"
        >
          {error && <p className="text-red-500">{error}</p>}
          {successMessage && <p className="text-green-500">{successMessage}</p>}
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
          <div className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="ghost"
              onClick={handleCancel}
              disabled={isSubmitting || !accountSettingsForm.formState.isDirty}
            >
              Cancel
            </Button>
            <Button type="submit" variant="secondary" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : 'Save'}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default AccountSettings;
