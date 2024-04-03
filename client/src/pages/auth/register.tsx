// Register page for the Frontend App
//
// Copyright (C) 2024 Ng Jun Xiang <contact@ngjx.org>.
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with this program.  If not, see <http://www.gnu.org/licenses/>.

import * as React from 'react';
import { useState } from 'react';
import { cn } from '@utils/tailwind';
import type { PageComponent } from '@pages/route-map';

import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, useFormState } from 'react-hook-form';

import {
  Form,
  FormDescription,
  FormField,
  FormLabel,
  FormItem,
  FormControl,
  FormMessage,
} from '@components/ui/form';
import { Input } from '@components/ui/input';
import { Switch } from '@components/ui/switch';
import { Button } from '@components/ui/button';

import httpClient from '@utils/http';
import { auth, schemas } from '@caffeine-addictt/fullstack-api-types';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

// Page
const RegisterPage: PageComponent = ({
  className,
  ...props
}): React.JSX.Element => {
  const [usernameAvailable, setUsernameAvailable] = useState<boolean>(false);

  const registerFormSchema = schemas.registerFormSchema.refine(
    () => usernameAvailable,
    { message: 'Username already taken!' },
  );

  const registerForm = useForm<z.infer<typeof registerFormSchema>>({
    resolver: zodResolver(registerFormSchema),
    defaultValues: {
      username: '',
      email: '',
      password: '',
      confirm: '',
      agreeMarketting: false,
      agreePolicy: false,
    },
  });
  const { isSubmitting } = useFormState({ control: registerForm.control });

  const queryClient = useQueryClient();

  // Validating username
  const username = registerForm.watch('username');
  useQuery(
    {
      queryKey: ['registerUsernameCheck', username],
      queryFn: async () => {
        const res = await httpClient
          .get<auth.AvailabilityAPI>({
            uri: `/availability?username=${username}`,
          })
          .catch((err) => console.log(err));

        // Update validation state
        setUsernameAvailable(res?.data.available || false);
        registerForm.trigger('username', { shouldFocus: false });
        return res ? res.data : false;
      },
      enabled: !!username, // Run check immediately only if username has a value
      refetchInterval: 60000, // Run check every minute
    },
    queryClient,
  );

  // Handling submiting
  const { mutate: createAccount } = useMutation(
    {
      mutationFn: async (data: z.infer<typeof registerFormSchema>) => {
        const res = await httpClient
          .post<
            auth.RegisterSuccAPI,
            typeof data
          >({ uri: '/register', payload: data })
          .catch((err) => console.log(err));
        if (res) {
          // TODO: Render toast
          // TODO: Redirect to login
          return res.data.created;
        }

        // TODO: Handle error
        return false;
      },
    },
    queryClient,
  );

  return (
    <div {...props} className={cn(className, 'flex-col pt-10 items-center')}>
      <h1 className="text-2xl font-bold">Register</h1>
      <Form {...registerForm}>
        <form
          onSubmit={registerForm.handleSubmit((data) => createAccount(data))}
          className="space-y-4"
        >
          <FormField
            control={registerForm.control}
            name="username"
            render={({ field, fieldState }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input
                    placeholder="John Doe"
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
            control={registerForm.control}
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
            control={registerForm.control}
            name="password"
            render={({ field, fieldState }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Your password"
                    type="password"
                    className={fieldState.error ? 'border-red-700' : ''}
                    {...field}
                  />
                </FormControl>
                {fieldState.error ? (
                  <FormMessage />
                ) : (
                  <FormDescription>Your account password.</FormDescription>
                )}
              </FormItem>
            )}
          />
          <FormField
            control={registerForm.control}
            name="confirm"
            render={({ field, fieldState }) => (
              <FormItem>
                <FormLabel>Confirm Your Password</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Retype your password"
                    type="password"
                    className={fieldState.error ? 'border-red-700' : ''}
                    {...field}
                  />
                </FormControl>
                {fieldState.error ? (
                  <FormMessage className="h-5" />
                ) : (
                  <FormDescription>Retype your password.</FormDescription>
                )}
              </FormItem>
            )}
          />
          <div className="space-y-2 pt-4">
            <FormField
              control={registerForm.control}
              name="agreeMarketting"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between gap-4 rounded-lg border p-3 shadow-sm">
                  <div className="space-y-0.5">
                    <FormLabel>Marketing emails</FormLabel>
                    <FormDescription>
                      Receive emails about new products, features, and more.
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={registerForm.control}
              name="agreePolicy"
              render={({ field, fieldState }) => (
                <FormItem
                  className={cn(
                    'flex flex-row items-center justify-between gap-4 rounded-lg border p-3 shadow-sm',
                    { 'border-red-700': fieldState.error },
                  )}
                >
                  <div className="space-y-0.5">
                    <FormLabel>
                      Agree to our terms of service{' '}
                      <span className="text-red-700">*</span>
                    </FormLabel>
                    <FormDescription>
                      Learn more about our <a href="">Terms of Service</a>.
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
          <div className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="ghost"
              onClick={() => registerForm.reset()}
              disabled={isSubmitting || !registerForm.formState.isDirty}
            >
              Clear
            </Button>
            <Button type="submit" variant="secondary" disabled={isSubmitting}>
              {isSubmitting ? 'Registering...' : 'Register'}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};
export default RegisterPage;
