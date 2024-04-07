// Shared API Types
//
// Copyright (C) 2024 Ng Jun Xiang <contact@ngjx.org>
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

import * as z from 'zod';

export const loginFormSchema = z.object({
  email: z
    .string({
      invalid_type_error: 'Please provide an email!',
      required_error: 'Please provide an email!',
    })
    .min(1, { message: 'Please provide an email!' })
    .email({
      message: 'Email is not valid!',
    }),
  password: z
    .string({
      invalid_type_error: 'Please provide a password!',
      required_error: 'Please provide a password!',
    })
    .min(1, { message: 'Please provide a password!' }),
});

export const registerFormSchema = z
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
