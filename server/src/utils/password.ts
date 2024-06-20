/**
 * SPDX-FileCopyrightText: 2024 Ng Jun Xiang <contact@ngjx.org>
 *
 * SPDX-License-Identifier: GPL-3.0-only
 */

import crypto from 'crypto';

const encrypt = async (password: string, salt: string): Promise<string> => {
  return crypto.pbkdf2Sync(password, salt, 300, 64, 'sha512').toString('hex');
};

// Exported functions
export const hashPassword = async (password: string): Promise<string> => {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = await encrypt(password, salt);

  return hash + salt;
};

export const matchPassword = async (
  password: string,
  hash: string,
): Promise<boolean> => {
  const stored = hash.slice(0, 65);
  const salt = hash.slice(64);
  const encrypted = await encrypt(password, salt);

  const a = Buffer.from(encrypted);
  const b = Buffer.from(stored);

  return (
    Buffer.byteLength(a) === Buffer.byteLength(b) &&
    crypto.timingSafeEqual(a, b)
  );
};
