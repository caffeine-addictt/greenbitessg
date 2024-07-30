import { useState, useContext } from 'react';

import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, useFormState } from 'react-hook-form';

import httpClient from '@utils/http';
import { AuthContext } from '@service/auth';
import { userUpdateSchema } from '@lib/api-types/schemas/user';
import type { UpdateUserSuccAPI } from '@lib/api-types/user';

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
  const { user } = useContext(AuthContext)!;
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

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
        setError('Error updating account details! Pelase try again later.');
        setSuccessMessage(null);
        console.log(err);
      });
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
              type="reset"
              variant="ghost"
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
