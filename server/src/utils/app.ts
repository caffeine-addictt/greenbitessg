/**
 * SPDX-FileCopyrightText: 2024 Ng Jun Xiang <contact@ngjx.org>
 *
 * SPDX-License-Identifier: GPL-3.0-only
 */

export const getHostDomain = () =>
  process.env.NODE_ENV === 'development'
    ? ('localhost:5173' as const)
    : ('greenbitessg.ngjx.org' as const);

export const getURL = () =>
  process.env.NODE_ENV === 'development'
    ? 'http://localhost:5173'
    : ('https://greenbitessg.ngjx.org' as const);

export const getFullPath = <T extends `/${string}`>(
  path: T,
): `${ReturnType<typeof getURL>}${T}` => `${getURL()}${path}`;
