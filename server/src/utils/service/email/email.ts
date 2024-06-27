/**
 * SPDX-FileCopyrightText: 2024 Ng Jun Xiang <contact@ngjx.org>
 *
 * SPDX-License-Identifier: GPL-3.0-only
 */

import { Resend } from 'resend';

import generateActivationEmail, {
  ActivationEmailProps,
} from './templates/account-activation';

const resend = new Resend(process.env.RESEND_API_KEY);

// Constants
type EmailLike = `${string}@greenbitessg.ngjx.org`;
type EmailWithSenderLike = `${string} <${EmailLike}>`;

interface IEmailOptions {
  type: string;
}
export type EmailOptions = IEmailOptions & ActivationEmailProps;

interface IEmailDetails {
  from: EmailWithSenderLike;
  to: string;
  subject?: string;
  text?: string;
  options: EmailOptions;
}

// Functions
export const sendEmail = (
  details: IEmailDetails,
): ReturnType<typeof resend.emails.send> => {
  let generated: string;

  switch (details.options.type) {
    case 'activation':
      generated = generateActivationEmail(details.options);
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
