/**
 * SPDX-FileCopyrightText: 2024 Ng Jun Xiang <contact@ngjx.org>
 *
 * SPDX-License-Identifier: GPL-3.0-only
 */

export type NestedOmit<
  Schema,
  Path extends string,
> = Path extends `${infer Head}.${infer Tail}`
  ? Head extends keyof Schema
    ? {
        [K in keyof Schema]: K extends Head
          ? NestedOmit<Schema[K], Tail>
          : Schema[K];
      }
    : Schema
  : Omit<Schema, Path>;
