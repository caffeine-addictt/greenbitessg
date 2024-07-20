import { useState, useEffect } from 'react';
import { useForm, useFormState } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { PageComponent } from '@pages/route-map';
import * as z from 'zod';
import httpClient from '@utils/http';

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

// Define the schema for account settings
const accountSettingsSchema = z.object({
  username: z.string().min(1, 'Username is required'),
  email: z.string().email('Invalid email address'),
  permission: z.string().min(1, 'Permission is required'),
});

// Define the AccountSettings component
const AccountSettings: PageComponent = ({ className, ...props }) => {
  const [id, setId] = useState<string>('');
  const [createdAt, setCreatedAt] = useState<string>('');
  const [updatedAt, setUpdatedAt] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const accountSettingsForm = useForm<z.infer<typeof accountSettingsSchema>>({
    resolver: zodResolver(accountSettingsSchema),
    defaultValues: {
      username: '',
      email: '',
      permission: '',
    },
  });

  const { isSubmitting } = useFormState({ control: accountSettingsForm.control });

  useEffect(() => {
    // Fetch account settings on component mount
    httpClient.get<{ id: string; username: string; email: string; permission: string; createdAt: string; updatedAt: string }>({
      uri: '/accountsettings',
    })
    .then((data) => {
      setId(data.id);
      accountSettingsForm.setValue('username', data.username);
      accountSettingsForm.setValue('email', data.email);
      accountSettingsForm.setValue('permission', data.permission);
      setCreatedAt(data.createdAt);
      setUpdatedAt(data.updatedAt);
    })
    .catch((err) => {
      console.error('Error fetching account settings:', err);
      setError('Error fetching account settings');
    });
  }, [accountSettingsForm]);

  const handleSave = (data: z.infer<typeof accountSettingsSchema>) => {
    // Update account settings using httpClient
    httpClient.post({
      uri: `/accountsettings/${id}`,
      payload: data,
    })
    .then((response) => {
      console.log('Account details updated successfully:', response);
      alert('Account details updated successfully');
      setError(null); // Clear any previous errors
    })
    .catch((error) => {
      console.error('There was an error updating the account details!', error);
      setError('Error updating account details');
    });
  };

  const handleCancel = () => {
    console.log('Cancelled');
    alert('Edit cancelled');
  };

  return (
    <div {...props} className={cn(className, "container mx-auto mt-16")}>
      <h1 className="text-center text-2xl font-bold">Account Settings</h1>
      <Form {...accountSettingsForm}>
        <form
          onSubmit={accountSettingsForm.handleSubmit(handleSave)}
          className="space-y-4 mt-8 w-[26.5rem]"
        >
          {error && <p className="text-red-500">{error}</p>}
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
                  <FormMessage />
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
                  <FormMessage />
                ) : (
                  <FormDescription>Your email address.</FormDescription>
                )}
              </FormItem>
            )}
          />
          <FormField
            control={accountSettingsForm.control}
            name="permission"
            render={({ field, fieldState }) => (
              <FormItem>
                <FormLabel>Permission</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Permission"
                    className={fieldState.error ? 'border-red-700' : ''}
                    {...field}
                  />
                </FormControl>
                {fieldState.error ? (
                  <FormMessage />
                ) : (
                  <FormDescription>Your account permission level.</FormDescription>
                )}
              </FormItem>
            )}
          />
          <div>
            <label className="block text-sm font-medium">Created At</label>
            <input
              type="text"
              className="mt-1 block w-full border rounded px-3 py-2"
              value={createdAt}
              disabled
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Updated At</label>
            <input
              type="text"
              className="mt-1 block w-full border rounded px-3 py-2"
              value={updatedAt}
              disabled
            />
          </div>
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
