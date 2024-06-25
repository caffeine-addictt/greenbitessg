/**
 * SPDX-FileCopyrightText: 2024 Ng Jun Xiang <contact@ngjx.org>
 *
 * SPDX-License-Identifier: GPL-3.0-only
 */

export interface ActivationEmailProps {
  type: 'activation';
  name: string;
  activationLink: string;
}

const generateActivationEmail = ({
  name,
  activationLink,
}: ActivationEmailProps): string => {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        body {
          font-family: Arial, sans-serif;
          background-color: #f6f6f6;
          margin: 0;
          padding: 0;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          background-color: #ffffff;
          padding: 20px;
          border-radius: 8px;
          box-shadow: 0 4px 8px rgba(0,0,0,0.1);
        }
        .header {
          text-align: center;
          padding-bottom: 20px;
        }
        .button {
          background-color: #007bff;
          color: white;
          padding: 10px 20px;
          text-decoration: none;
          border-radius: 4px;
          display: inline-block;
          margin-top: 20px;
        }
        .footer {
          text-align: center;
          color: #888888;
          font-size: 12px;
          padding-top: 20px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h2>Welcome to Our Service, ${name}!</h2>
        </div>
        <div>
          <p>Thank you for signing up for our service. To complete your registration, please activate your account by clicking the button below.</p>
          <a href="${activationLink}" class="button">Activate Account</a>
          <p>If the button above does not work, copy and paste the following link into your web browser:</p>
          <a href="${activationLink}">${activationLink}</a>
          <p>If you did not sign up for this account, please disregard this email.</p>
        </div>
        <div class="footer">
          <p>&copy; ${new Date().getFullYear()} Our Service. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;
};
export default generateActivationEmail;
