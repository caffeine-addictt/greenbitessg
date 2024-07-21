/**
 * SPDX-FileCopyrightText: 2024 Ng Jun Xiang <contact@ngjx.org>
 *
 * SPDX-License-Identifier: GPL-3.0-only
 */

/* eslint-disable @typescript-eslint/no-var-requires */
const { hashPassword, matchPassword } = require('./password');

describe('password', () => {
  describe('hashPassword', () => {
    it('should hash password', async () => {
      const password = 'password';
      const hashedPassword = await hashPassword(password);
      expect(hashedPassword).not.toBe(password);
    });
  });

  describe('matchPassword', () => {
    it('should match password', async () => {
      const password = 'password';
      const hashedPassword = await hashPassword(password);
      const matched = await matchPassword(password, hashedPassword);
      expect(matched).toBe(true);
    });

    it('should not match password', async () => {
      const password = 'password';
      const hashedPassword = await hashPassword(password);
      const matched = await matchPassword('wrong', hashedPassword);
      expect(matched).toBe(false);
    });
  });
});
