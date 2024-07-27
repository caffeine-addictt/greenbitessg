/**
 * SPDX-FileCopyrightText: 2024 Ng Jun Xiang <contact@ngjx.org>
 *
 * SPDX-License-Identifier: GPL-3.0-only
 */

import { config } from 'dotenv';
config();

const requireEnv = (name: string): void => {
  if (!process.env[name]) {
    console.log(`Environment varaible "${name}" is not set`);
    process.exit(1);
  }
};

process.env.NODE_ENV = process.env.NODE_ENV || 'development';

requireEnv('DATABASE_URL');
requireEnv('JWT_ACCESS_KEY');
requireEnv('JWT_REFRESH_KEY');
requireEnv('RESEND_API_KEY');
requireEnv('UPLOADTHING_APP_ID');
requireEnv('UPLOADTHING_SECRET');
