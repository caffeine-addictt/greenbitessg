/**
 * SPDX-FileCopyrightText: 2024 Ng Jun Xiang <contact@ngjx.org>
 *
 * SPDX-License-Identifier: GPL-3.0-only
 */

import { PageComponent } from '@pages/route-map';
import AuthLayout from './auth-layout';
import { InternalLink } from '@components/ui/button';
import { EnvelopeClosedIcon } from '@radix-ui/react-icons';

const RegisterOptionsPage: PageComponent = (props) => {
  return (
    <AuthLayout
      {...props}
      title="Register"
      subTitle={
        <>
          We hope you enjoy learning with us!
          <br />
          よろしくお願いします〜
        </>
      }
    >
      <div className="my-auto flex w-96 flex-col gap-2 max-sm:w-[90%] max-sm:min-w-56 max-sm:max-w-96">
        <InternalLink href="/auth/register" variant="default" preserveCallback>
          <EnvelopeClosedIcon className="mr-2 size-6" />
          Register with email
        </InternalLink>

        {/* Link to register */}
        <p className="text-center text-sm">
          Already have an account?{' '}
          <InternalLink
            href="/login"
            variant="link"
            className="m-0 size-fit p-0"
            preserveCallback
          >
            Login -&gt;
          </InternalLink>
        </p>
      </div>
    </AuthLayout>
  );
};
export default RegisterOptionsPage;
