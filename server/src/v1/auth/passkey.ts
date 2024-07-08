/**
 * SPDX-FileCopyrightText: 2024 Ng Jun Xiang <contact@ngjx.org>
 *
 * SPDX-License-Identifier: GPL-3.0-only
 */

import type { IAuthedRouteHandler } from '../../route-map';

import type { auth } from '../../lib/api-types/';
import { Http4XX } from '../../lib/api-types/http-codes';

import { db } from '../../db';
import { eq } from 'drizzle-orm';
import { passkeyChallengesTable, passkeysTable } from '../../db/schemas';

import type { AuthenticatorTransportFuture } from '@simplewebauthn/server/script/deps';
import {
  generateRegistrationOptions,
  verifyRegistrationResponse,
} from '@simplewebauthn/server';

// Constants
const RP_ID = 'greenbitessg.ngjx.org' as const;
const RP_NAME = 'GreenbitesSG' as const;

// Start register passkey
export const registerPasskeyStart: IAuthedRouteHandler = async (req, res) => {
  // Delete active challenges
  await db
    .delete(passkeyChallengesTable)
    .where(eq(passkeyChallengesTable.userId, req.user.id));

  // Get existing passkeys
  const passkeys = await db
    .select({ id: passkeysTable.id, transports: passkeysTable.transports })
    .from(passkeysTable)
    .where(eq(passkeysTable.userId, req.user.id));
  const opts = await generateRegistrationOptions({
    rpName: RP_NAME,
    rpID: RP_ID,
    userName: req.user.username,
    timeout: 60000,
    attestationType: 'none',
    excludeCredentials: passkeys.map((p) => ({
      id: p.id,
      transports: p.transports,
    })),
  });

  // Save challenge after converted with convertChallenge()
  await db.insert(passkeyChallengesTable).values({
    userId: req.user.id,
    challenge: opts.challenge,
    challengeUserId: opts.user.id,
  });

  return res.status(201).json({
    status: 201,
    data: opts,
  } satisfies auth.RegisterPasskeysStartSuccAPI);
};
