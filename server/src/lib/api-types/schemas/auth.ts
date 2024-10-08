/**
 * SPDX-FileCopyrightText: 2024 Ng Jun Xiang <contact@ngjx.org>
 *
 * SPDX-License-Identifier: GPL-3.0-only
 */

import {
  VerifyAuthenticationResponseOpts,
  VerifyRegistrationResponseOpts,
} from '@simplewebauthn/server';
import * as z from 'zod';

export type PasskeyData = {
  id: number;
  counter: number;
  device_type: string;
  created_at: Date;
  updated_at: Date;
};

export const activateFormSchema = z.object({
  token: z
    .string({
      invalid_type_error: 'Please provide a token!',
      required_error: 'Please provide a token!',
    })
    .min(1, { message: 'Please provide a token!' }),
});

export const invalidateTokenSchema = z.object({
  access_token: z
    .string({
      invalid_type_error: 'Please provide an access token!',
      required_error: 'Please provide an access token!',
    })
    .min(1, { message: 'Please provide an access token!' }),
});

export const recreateTokenSchema = z.object({
  token_type: z
    .string({
      invalid_type_error: 'Please provide a token type!',
      required_error: 'Please provide a token type!',
    })
    .min(1, { message: 'Please provide a token type!' }),
});

export const refreshTokenSchema = z.object({
  access_token: z
    .string({
      invalid_type_error: 'Please provide an access token!',
      required_error: 'Please provide an access token!',
    })
    .min(1, { message: 'Please provide an access token!' }),
});

export const passkeyLoginSchema = z.object({
  email: z
    .string({
      invalid_type_error: 'Please provide an email!',
      required_error: 'Please provide an email!',
    })
    .min(1, { message: 'Please provide an email!' })
    .email({
      message: 'Email is not valid!',
    }),
});

export type passkeyLoginFinishSchema = {
  /** UUID */
  track: string;
  signed: VerifyAuthenticationResponseOpts['response'];
};

export type passkeyRegisterFinishSchema = {
  /** UUID */
  track: string;
  signed: VerifyRegistrationResponseOpts['response'];
};

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

export const registerFormSchema = z.object({
  username: z
    .string({
      invalid_type_error: 'Please provide a username!',
      required_error: 'Please provide a username!',
    })
    .min(1, { message: 'Please provide a username!' })
    .min(3, { message: 'Username needs to be at least 3 characters!' })
    .max(20, { message: 'Username cannot be longer than 20 characters!' })
    .regex(/^[\w-_]+$/, {
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
    .regex(/[0-9]/, {
      message: 'Password needs to contain at least 1 digit! (0-9)',
    })
    .regex(/[!#$%&?'"]/, {
      message:
        'Password needs to contain at least 1 special character! (!#$%&?\'")',
    }),
});
