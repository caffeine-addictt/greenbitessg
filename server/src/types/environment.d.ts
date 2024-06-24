/**
 * SPDX-FileCopyrightText: 2024 Ng Jun Xiang <contact@ngjx.org>
 *
 * SPDX-License-Identifier: GPL-3.0-only
 */

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: 'development' | 'production';
      DATABASE_URL: string;
      JWT_ACCESS_KEY: string;
      JWT_REFRESH_KEY: string;
      RESEND_API_KEY: string;
    }
  }
}

export {};
