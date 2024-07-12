/**
 * SPDX-FileCopyrightText: 2024 Ng Jun Xiang <contact@ngjx.org>
 *
 * SPDX-License-Identifier: GPL-3.0-only
 */

import { PageComponent } from '@pages/route-map';
import AuthLayout from './auth-layout';
import { InternalLink } from '@components/ui/button';
import { EnvelopeClosedIcon } from '@radix-ui/react-icons';
import { KeyRoundIcon } from 'lucide-react';

const LoginOptionsPage: PageComponent = (props) => {
  return (
    <AuthLayout {...props}>
      {/* Header */}
      <div className="mt-20 text-center">
        <h1 className="mb-1 text-4xl font-bold">Welcome back!</h1>
        <p className="text-sm">
          Welcome back! Please sign in to your account.
          <br />
          おかえりなさい〜
        </p>
      </div>

      {/* Options */}
      <div className="mt-32 flex w-96 flex-col gap-2 max-sm:w-[90%] max-sm:min-w-56 max-sm:max-w-96">
        <InternalLink href="/auth/login" variant="default">
          <EnvelopeClosedIcon className="mr-2 size-6" />
          Log in with email
        </InternalLink>
        <InternalLink href="/auth0/login" variant="default">
          <KeyRoundIcon className="mr-2 size-6" />
          Log in with passkeys
        </InternalLink>

        {/* Link to register */}
        <p className="text-center text-sm">
          Or create an account{' '}
          <InternalLink
            href="/register"
            variant="link"
            className="m-0 size-fit p-0"
          >
            here
          </InternalLink>
          !
        </p>
      </div>
    </AuthLayout>
  );
};
export default LoginOptionsPage;
