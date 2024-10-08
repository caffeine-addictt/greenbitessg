/**
 * SPDX-FileCopyrightText: 2024 Ng Jun Xiang <contact@ngjx.org>
 *
 * SPDX-License-Identifier: GPL-3.0-only
 */

import { Resend } from 'resend';

import generateActivationEmail, {
  ActivationEmailProps,
} from './templates/account-activation';
import generateVerificationEmail, {
  VerificationEmailProps,
} from './templates/verification-code';
import { NestedOmit } from '@src/utils/types';

const resend = new Resend(process.env.RESEND_API_KEY);

// Constants
type EmailLike = `${string}@greenbitessg.ngjx.org`;
type EmailWithSenderLike = `${string} <${EmailLike}>`;

interface IEmailOptions {
  type: string;
}
interface IEmailDetails<T extends IEmailOptions = IEmailOptions> {
  from: EmailWithSenderLike;
  to: string;
  subject?: string;
  text?: string;
  options: T;
}

// Functions
export const sendEmail = (
  details: IEmailDetails,
): ReturnType<typeof resend.emails.send> => {
  let generated: string;

  switch (details.options.type) {
    case 'activation':
      generated = generateActivationEmail(
        details.options as ActivationEmailProps,
      );
      break;

    case 'verification':
      generated = generateVerificationEmail(
        details.options as VerificationEmailProps,
      );
      break;

    default:
      throw new Error('Invalid email type');
  }

  return resend.emails.send({
    from: details.from,
    to: details.to,
    subject: details.subject ?? '',
    text: details.text,
    html: generated,
  });
};

export const sendActivationEmail = (
  details: NestedOmit<
    Omit<
      IEmailDetails<IEmailOptions & ActivationEmailProps>,
      'from' | 'subject' | 'text'
    > & {
      options: ActivationEmailProps;
    },
    'options.type'
  >,
): ReturnType<typeof sendEmail> =>
  sendEmail({
    from: 'GreenBites SG <onboarding@greenbitessg.ngjx.org>',
    to: details.to,
    subject: 'Activate your GreenBites account',
    text: `Activate your GreenBites account by going to the following link: ${details.options.activationLink}`,
    options: {
      ...details.options,
      type: 'activation',
    },
  });

export const sendVerificationEmail = (
  details: Omit<
    IEmailDetails<IEmailOptions & VerificationEmailProps>,
    'from' | 'subject' | 'text'
  > & {
    options: VerificationEmailProps;
  },
): ReturnType<typeof sendEmail> =>
  sendEmail({
    from: 'GreenBites SG <noreply@greenbitessg.ngjx.org>',
    to: details.to,
    subject: 'Verify Your Account',
    text: `Your verification code is: ${details.options.verificationLink}`,
    options: {
      ...details.options,
      type: 'verification',
    },
  });
