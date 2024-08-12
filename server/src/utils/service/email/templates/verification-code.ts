/**
 * SPDX-FileCopyrightText: 2024 Ng Jun Xiang <contact@ngjx.org>
 *
 * SPDX-License-Identifier: GPL-3.0-only
 */

export interface VerificationEmailProps {
  type: 'verification';
  name: string;
  verificationLink: string; // Change from verificationCode to verificationLink
}

const generateVerificationEmail = ({
  name,
  verificationLink,
}: VerificationEmailProps): string => {
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
            <h2>Hello, ${name}!</h2>
          </div>
          <div>
            <p>To verify your username, please click the button below:</p>
            <a href="${verificationLink}" class="button">Verify Email</a>
            <p>If you did not request this verification, please ignore this email.</p>
          </div>
          <div class="footer">
            <p>&copy; ${new Date().getFullYear()} Green Bites SG. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;
};

export default generateVerificationEmail;
