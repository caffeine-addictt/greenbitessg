/**
 * SPDX-FileCopyrightText: 2024 Ng Jun Xiang <contact@ngjx.org>
 *
 * SPDX-License-Identifier: GPL-3.0-only
 */

import { base64ToBytes, bytesToBase64 } from './bytearry-encoding';

describe('encoding', () => {
  it('base64ToBytes', () => {
    expect(base64ToBytes('')).toEqual(new Uint8Array());
    expect(base64ToBytes('aGVsbG8=')).toEqual(
      new Uint8Array([0x68, 0x65, 0x6c, 0x6c, 0x6f]),
    );
  });

  it('bytesToBase64', () => {
    expect(bytesToBase64(new Uint8Array())).toEqual('');
    expect(
      bytesToBase64(new Uint8Array([0x68, 0x65, 0x6c, 0x6c, 0x6f])),
    ).toEqual('aGVsbG8=');
  });
});
