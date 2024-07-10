/**
 * SPDX-FileCopyrightText: 2024 Ng Jun Xiang <contact@ngjx.org>
 *
 * SPDX-License-Identifier: GPL-3.0-only
 */

import type { IAuthedRouteHandler, IBareRouteHandler } from '../../route-map';

import type { ZodIssue } from 'zod';
import { errors, schemas, type auth } from '../../lib/api-types/';
import { Http4XX } from '../../lib/api-types/http-codes';

import { db } from '../../db';
import { eq, and } from 'drizzle-orm';
import {
  passkeyChallengesTable,
  passkeysTable,
  usersTable,
} from '../../db/schemas';

import type { AuthenticatorTransportFuture } from '@simplewebauthn/server/script/deps';
import {
  generateAuthenticationOptions,
  generateRegistrationOptions,
  verifyAuthenticationResponse,
  verifyRegistrationResponse,
} from '@simplewebauthn/server';
import { signJwt } from '../../utils/service/auth/jwt';
import { getHostDomain } from '../../utils/app';

// Constants
const RP_ID = getHostDomain();
const RP_NAME = 'GreenbitesSG' as const;

// Start login passkey
export const loginPasskeyStart: IBareRouteHandler = async (req, res) => {
  // Validate request body
  const validated = schemas.auth.passkeyLoginSchema.safeParse(req.body);
  if (!validated.success) {
    const errorStack: errors.CustomErrorContext[] = [];
    validated.error.errors.forEach((error: ZodIssue) => {
      errorStack.push({
        message: error.message,
        context: {
          property: error.path,
          code: error.code,
        },
      });
    });

    return res.status(Http4XX.BAD_REQUEST).json({
      status: Http4XX.BAD_REQUEST,
      errors: errorStack,
    } satisfies auth.LoginPasskeysStartFailAPI);
  }

  // Get user
  const foundUsers = await db
    .select({
      userId: usersTable.id,
      passkey: {
        id: passkeysTable.id,
        transports: passkeysTable.transports,
      },
    })
    .from(usersTable)
    .where(eq(usersTable.email, validated.data.email))
    .limit(1)
    .innerJoin(passkeysTable, eq(passkeysTable.userId, usersTable.id));

  if (!foundUsers.length) {
    return res.status(400).json({
      status: 400,
      errors: [{ message: 'Account does not exist!' }],
    } satisfies auth.LoginPasskeysStartFailAPI);
  }

  // Gen opts
  const opts = await generateAuthenticationOptions({
    rpID: RP_ID,
    allowCredentials: foundUsers.map((p) => p.passkey),
  });

  // Save challenge
  const created = await db
    .insert(passkeyChallengesTable)
    .values({
      userId: foundUsers[0].userId,
      type: 'authenticate',
      challenge: opts.challenge,
      challengeUserId: foundUsers[0].passkey.id,
    })
    .returning({ id: passkeyChallengesTable.id });

  return res.status(201).json({
    status: 201,
    data: {
      track: created[0].id,
      challenge: opts,
    },
  } satisfies auth.LoginPasskeysStartSuccAPI);
};

// Finish login passkey
export const loginPasskeyFinish: IBareRouteHandler = async (req, res) => {
  const castedBody = req.body as Partial<schemas.auth.passkeyLoginFinishSchema>;

  if (!castedBody.track || !castedBody.signed) {
    return res.status(Http4XX.FORBIDDEN).json({
      status: Http4XX.FORBIDDEN,
      errors: [{ message: 'No passkey challenges found' }],
    } satisfies auth.LoginPasskeysFinishFailAPI);
  }

  if (
    !castedBody.track.match(
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i,
    )
  ) {
    return res.status(Http4XX.FORBIDDEN).json({
      status: Http4XX.FORBIDDEN,
      errors: [{ message: 'No passkey challenges found' }],
    } satisfies auth.LoginPasskeysFinishFailAPI);
  }

  const currentChallenges = await db
    .select()
    .from(passkeyChallengesTable)
    .where(
      and(
        eq(passkeyChallengesTable.id, castedBody.track),
        eq(passkeyChallengesTable.type, 'authenticate'),
      ),
    )
    .limit(1);
  if (!currentChallenges.length) {
    return res.status(Http4XX.FORBIDDEN).json({
      status: Http4XX.FORBIDDEN,
      errors: [{ message: 'No passkey challenges found' }],
    } satisfies auth.LoginPasskeysFinishFailAPI);
  }

  const passkeys = await db
    .select()
    .from(passkeysTable)
    .where(eq(passkeysTable.id, castedBody.signed.id))
    .limit(1);
  if (!passkeys.length) {
    return res.status(Http4XX.FORBIDDEN).json({
      status: Http4XX.FORBIDDEN,
      errors: [{ message: 'No passkey challenges found' }],
    } satisfies auth.LoginPasskeysFinishFailAPI);
  }

  // Parse body
  let verification;
  try {
    verification = await verifyAuthenticationResponse({
      response: castedBody.signed,
      expectedChallenge: currentChallenges[0].challenge,
      expectedOrigin: `https://${RP_ID}`,
      expectedRPID: RP_ID,
      authenticator: {
        credentialID: passkeys[0].id,
        credentialPublicKey: passkeys[0].publicKey,
        counter: passkeys[0].counter,
        transports: passkeys[0].transports,
      },
    });
  } catch (err) {
    console.log(`ERR ${err}`);
    return res.status(500).json({
      status: 500,
      errors: [{ message: 'Failed to authenticate passkey' }],
    } satisfies auth.LoginPasskeysFinishFailAPI);
  }

  if (!verification.verified || !verification.authenticationInfo) {
    return res.status(400).json({
      status: 400,
      errors: [{ message: 'Failed to authenticate passkey' }],
    } satisfies auth.LoginPasskeysFinishFailAPI);
  }

  // Update counter
  await db
    .update(passkeysTable)
    .set({ counter: verification.authenticationInfo.newCounter })
    .where(eq(passkeysTable.id, passkeys[0].id));

  const accessToken = signJwt({ sub: passkeys[0].userId }, 'access');
  const refreshToken = signJwt({ sub: passkeys[0].userId }, 'refresh');

  return res.status(201).json({
    status: 201,
    data: {
      access_token: accessToken,
      refresh_token: refreshToken,
    },
  } satisfies auth.LoginPasskeysFinishSuccAPI);
};

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
  const created = await db
    .insert(passkeyChallengesTable)
    .values({
      type: 'register',
      userId: req.user.id,
      challenge: opts.challenge,
      challengeUserId: opts.user.id,
    })
    .returning({ id: passkeyChallengesTable.id });

  return res.status(201).json({
    status: 201,
    data: {
      track: created[0].id,
      challenge: opts,
    },
  } satisfies auth.RegisterPasskeysStartSuccAPI);
};

// Finish register passkey
export const registerPasskeyFinish: IAuthedRouteHandler = async (req, res) => {
  const castedBody =
    req.body as Partial<schemas.auth.passkeyRegisterFinishSchema>;

  if (!castedBody.track || !castedBody.signed) {
    return res.status(Http4XX.FORBIDDEN).json({
      status: Http4XX.FORBIDDEN,
      errors: [{ message: 'No passkey challenges found' }],
    } satisfies auth.RegisterPasskeysFinishFailAPI);
  }

  if (
    !castedBody.track.match(
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i,
    )
  ) {
    return res.status(Http4XX.FORBIDDEN).json({
      status: Http4XX.FORBIDDEN,
      errors: [{ message: 'No passkey challenges found' }],
    } satisfies auth.RegisterPasskeysFinishFailAPI);
  }

  const currentChallenges = await db
    .select()
    .from(passkeyChallengesTable)
    .where(
      and(
        eq(passkeyChallengesTable.id, castedBody.track),
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

  // Cleanup challenge
  await db
    .delete(passkeyChallengesTable)
    .where(
      eq(passkeyChallengesTable.challenge, currentChallenges[0].challenge),
    );

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
