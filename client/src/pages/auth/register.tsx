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
import { cn } from '@utils/tailwind';
import type { PageComponent } from '@pages/route-map';

import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { SubmitHandler, useForm, useFormState } from 'react-hook-form';

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

// Setup
const registerFormSchema = z
  .object({
    username: z
      .string({
        invalid_type_error: 'Please provide a username!',
        required_error: 'Please provide a username!',
      })
      .min(1, { message: 'Please provide a username!' })
      .min(3, { message: 'Username needs to be at least 3 characters!' })
      .max(20, { message: 'Username cannot be longer than 20 characters!' })
      .regex(/^[\w\d-_]+$/, {
        message: 'Username may only contain alphanumeric characters and (-_)',
      }),

    email: z
      .string({
        invalid_type_error: 'Please provide an email!',
        required_error: 'Please provide an email!',
      })
      .min(1, { message: 'Please provide an email!' })
      .email({ message: 'Email is not valid!' }),

    password: z
      .string({
        invalid_type_error: 'Please provide a password!',
        required_error: 'Please provide a password!',
      })
      .min(1, { message: 'Please provide a password!' })
      .min(8, { message: 'Password needs to be at least 8 characters!' })
      .regex(/[a-z]/, {
        message:
          'Password needs to contain at least 1 lower case character! (a-z)',
      })
      .regex(/[A-Z]/, {
        message:
          'Password needs to contain at least 1 upper case character! (A-Z)',
      })
      .regex(/[\d]/, {
        message: 'Password needs to contain at least 1 digit! (0-9)',
      })
      .regex(/[!#$%&?'"]/, {
        message:
          'Password needs to contain at least 1 special character! (!#$%&?\'")',
      })
      .regex(/^[a-zA-Z\d!#$%&?'"]+$/, {
        message:
          'Passwords may only contain alphanumeric characters and (!#$%&?\'")',
      }),

    confirm: z
      .string({
        invalid_type_error: 'Please retype your password!',
        required_error: 'Please retype your password!',
      })
      .min(1, { message: 'Please retype your password!' }),

    agreeMarketting: z.boolean().optional(),

    agreePolicy: z.boolean().refine((val) => val === true, {
      message: 'Please agree to our Terms of Service!',
    }),
  })
  .refine((data) => data.password === data.confirm, {
    message: 'Passwords do not match!',
    path: ['confirm'],
  });

// Page
export type SubmitHandlerType = SubmitHandler<
  z.infer<typeof registerFormSchema>
>;
const RegisterPage: PageComponent = ({
  className,
  ...props
}): React.JSX.Element => {
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

  // Handling submiting
  const handleSubmit: SubmitHandlerType = async (data) => {
    console.log(data);
    return data;
  };

  return (
    <div
      {...props}
      className={cn(className, 'flex-col justify-center items-center')}
    >
      <h1 className="text-2xl font-bold">Register</h1>
      <Form {...registerForm}>
        <form
          onSubmit={registerForm.handleSubmit(handleSubmit)}
          className="space-y-1"
        >
          <FormField
            control={registerForm.control}
            name="username"
            render={({ field, fieldState }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input placeholder="John Doe" {...field} />
                </FormControl>
                {fieldState.error ? (
                  <FormMessage />
                ) : (
                  <div className="h-5 w-1" />
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
                  <Input placeholder="johndoe@example.com" {...field} />
                </FormControl>
                {fieldState.error ? (
                  <FormMessage />
                ) : (
                  <div className="h-5 w-1" />
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
                    {...field}
                  />
                </FormControl>
                {fieldState.error ? (
                  <FormMessage />
                ) : (
                  <div className="h-5 w-1" />
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
                    {...field}
                  />
                </FormControl>
                {fieldState.error ? (
                  <FormMessage className="h-6" />
                ) : (
                  <div className="h-5 w-1" />
                )}
              </FormItem>
            )}
          />
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
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Registering...' : 'Register'}
          </Button>
        </form>
      </Form>
    </div>
  );
};
export default RegisterPage;
