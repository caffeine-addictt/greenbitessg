/**
 * SPDX-FileCopyrightText: 2024 Ng Jun Xiang <contact@ngjx.org>
 *
 * SPDX-License-Identifier: GPL-3.0-only
 */

import type { IAuthedRouteHandler } from '../../route-map';

import type { auth } from '../../lib/api-types/';
import { Http4XX } from '../../lib/api-types/http-codes';

import { db } from '../../db';
import { eq, and } from 'drizzle-orm';
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
    type: 'register',
    userId: req.user.id,
    challenge: opts.challenge,
    challengeUserId: opts.user.id,
  });

  return res.status(201).json({
    status: 201,
    data: opts,
  } satisfies auth.RegisterPasskeysStartSuccAPI);
};

// Finish register passkey
export const registerPasskeyFinish: IAuthedRouteHandler = async (req, res) => {
  const currentChallenges = await db
    .select()
    .from(passkeyChallengesTable)
    .where(
      and(
        eq(passkeyChallengesTable.userId, req.user.id),
        eq(passkeyChallengesTable.type, 'register'),
      ),
    )
    .limit(1);
  if (!currentChallenges.length) {
    return res.status(Http4XX.FORBIDDEN).json({
      status: Http4XX.FORBIDDEN,
      errors: [{ message: 'No passkey challenges found' }],
    } satisfies auth.RegisterPasskeysFinishFailAPI);
  }

  // Parse body
  let verification;
  try {
    verification = await verifyRegistrationResponse({
      response: req.body,
      expectedChallenge: currentChallenges[0].challenge,
      expectedOrigin: `https://${RP_ID}`,
      expectedRPID: RP_ID,
    });
  } catch (err) {
    console.log(`ERR ${err}`);
    return res.status(500).json({
      status: 500,
      errors: [{ message: 'Failed to register passkey' }],
    } satisfies auth.RegisterPasskeysFinishFailAPI);
  }

  if (!verification.verified || !verification.registrationInfo!) {
    return res.status(400).json({
      status: 400,
      errors: [{ message: 'Failed to register passkey' }],
    } satisfies auth.RegisterPasskeysFinishFailAPI);
  }

  // Register passkey
  await db.insert(passkeysTable).values({
    counter: 0,
    userId: req.user.id,
    id: verification.registrationInfo.credentialID,
    webAuthnUserId: currentChallenges[0].challengeUserId,
    backedUp: verification.registrationInfo.credentialBackedUp,
    publicKey: verification.registrationInfo.credentialPublicKey,
    deviceType: verification.registrationInfo.credentialDeviceType,
    transports: req.body.response.transports as AuthenticatorTransportFuture[],
  });

  return res.status(201).json({
    status: 201,
    data: {
      created: true,
    },
  } satisfies auth.RegisterPasskeysFinishSuccAPI);
};
