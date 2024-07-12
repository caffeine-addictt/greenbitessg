/**
 * SPDX-FileCopyrightText: 2024 Ng Jun Xiang <contact@ngjx.org>
 *
 * SPDX-License-Identifier: GPL-3.0-only
 */

import { useLocation } from 'react-router-dom';

import type { PageComponent } from '@pages/route-map';
import { InternalLink } from '@components/ui/button';

export const HeaderSliderLocation = ({
  label,
  atPage,
}: {
  label: string;
  atPage: boolean;
}) => (
  <InternalLink
    href={atPage ? '/login' : '/register'}
    variant={atPage ? 'secondary' : 'default'}
  >
    {label}
  </InternalLink>
);

export const AuthLayout: PageComponent = ({
  className,
  children,
  ...props
}) => {
  const location = useLocation();
  const isLogin = !!location.pathname.match('/login');

  return (
    <div {...props} className={className}>
      <div className="mx-auto my-4 flex w-full grow-0 flex-col rounded bg-surface-light p-2 sm:w-[95%] sm:flex-row dark:bg-surface-dark">
        {/* Login side (desktop:left, mobile:top) */}
        <div className="flex size-full flex-col sm:w-1/2">
          {/* Header */}
          <div className="flex flex-row justify-between">
            {/* Logo */}
            <div className="flex flex-row items-center gap-4">
              <img
                src=""
                alt=""
                width={32}
                height={32}
                className="size-12 rounded-full"
              />
              <h1 className="text-3xl font-bold">Green Bites SG</h1>
            </div>

            {/* Slider */}
            <div className="flex flex-row items-center gap-4 rounded-lg bg-background-light px-2 dark:bg-background-dark">
              <HeaderSliderLocation label="Login" atPage={isLogin} />
              <HeaderSliderLocation label="Sign up" atPage={!isLogin} />
            </div>
          </div>

          {/* Body content */}
          <div className="grow">{children}</div>

          {/* Footer */}
          <div className="flex flex-col text-sm">
            {isLogin ? (
              <span>
                Or{' '}
                <InternalLink
                  className="h-fit p-0"
                  variant="link"
                  href="/register"
                >
                  create an account here!
                </InternalLink>
              </span>
            ) : (
              <span>
                By proceeding, you agree to our{' '}
                <InternalLink className="h-fit p-0" variant="link" href="/tos">
                  terms of service
                </InternalLink>{' '}
                and{' '}
                <InternalLink
                  className="h-fit p-0"
                  variant="link"
                  href="/privacy"
                >
                  privacy policy
                </InternalLink>
                .
              </span>
            )}

            <div className="flex flex-row gap-2">
              <InternalLink className="h-fit p-0" variant="link" href="/help">
                Help
              </InternalLink>
              <InternalLink
                className="h-fit p-0"
                variant="link"
                href="/privacy"
              >
                Privacy
              </InternalLink>
              <InternalLink className="h-fit p-0" variant="link" href="/tos">
                Terms
              </InternalLink>
            </div>
          </div>
        </div>

        {/* Images side (desktop:right, mobile:hidden) */}
        <div className="h-full w-1/2 max-sm:hidden">images</div>
      </div>
    </div>
  );
};
export default AuthLayout;
