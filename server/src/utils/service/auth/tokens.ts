/**
 * SPDX-FileCopyrightText: 2024 Ng Jun Xiang <contact@ngjx.org>
 *
 * SPDX-License-Identifier: GPL-3.0-only
 */

import type { TokenType } from '../../../db/schemas';

export interface ITokenSettings {
  /** minimum time */
  min: number;
  /** maximum time */
  max: number;
}
export type TokenSettings = { [k in TokenType]: ITokenSettings };
export const TOKEN_SETTINGS: TokenSettings = {
  activation: {
    min: 60, // 1 minute
    max: 60 * 60 * 24, // 1 day
  },
  verification: {
    min: 60, // 1 minute
    max: 60 * 60, // 1 hour
  },
} as const;
