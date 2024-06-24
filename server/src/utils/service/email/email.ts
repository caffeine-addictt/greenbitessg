/**
 * SPDX-FileCopyrightText: 2024 Ng Jun Xiang <contact@ngjx.org>
 *
 * SPDX-License-Identifier: GPL-3.0-only
 */

import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

// Constants
type EmailLike = `${string}@greenbitessg.ngjx.org`;
type EmailWithSenderLike = `${string} <${EmailLike}`;

// Functions
export const sendEmail = (
  from: EmailWithSenderLike,
  to: string,
  subject: string,
  text: string,
  html: string,
): ReturnType<typeof resend.emails.send> =>
  resend.emails.send({
    from: from,
    to: to,
    subject: subject,
    text: text,
    html: html,
  });
