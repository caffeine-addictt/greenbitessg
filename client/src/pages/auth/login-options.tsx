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
    <AuthLayout
      {...props}
      title="Welcome back!"
      subTitle={
        <>
          Welcome back! Please sign in to your account.
          <br />
          おかえりなさい〜
        </>
      }
    >
      <div className="my-auto flex w-96 flex-col gap-2 max-sm:w-[90%] max-sm:min-w-56 max-sm:max-w-96">
        <InternalLink href="/auth/login" variant="default" preserveCallback>
          <EnvelopeClosedIcon className="mr-2 size-6" />
          Log in with email
        </InternalLink>
        <InternalLink href="/auth0/login" variant="default" preserveCallback>
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
            preserveCallback
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
