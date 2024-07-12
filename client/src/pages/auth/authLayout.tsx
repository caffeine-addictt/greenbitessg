/**
 * SPDX-FileCopyrightText: 2024 Ng Jun Xiang <contact@ngjx.org>
 *
 * SPDX-License-Identifier: GPL-3.0-only
 */

import { useLocation } from 'react-router-dom';

import type { PageComponent } from '@pages/route-map';
import { InternalLink } from '@components/ui/button';

import { useMediaQuery } from '@components/hooks';

// Constants
type ImageType = {
  name: string;
  ext: 'png' | 'jpg';
  sizes: `${number}x${number}`[];
  default: number;
  className?: string;
};
const images: ImageType[] = [
  {
    name: 'cooking-class',
    ext: 'png',
    sizes: ['354x500', '707x1000', '1414x2000'],
    default: 2,
    className: 'max-w-[99.9%]',
  },
  {
    name: 'food-drive',
    ext: 'png',
    sizes: ['354x500', '707x1000', '1414x2000'],
    default: 2,
  },
  {
    name: 'menu-item',
    ext: 'png',
    sizes: ['354x500', '707x1000', '1414x2000'],
    default: 2,
  },
] as const;

// Components
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
  const isLgScreen = useMediaQuery('(min-width: 1024px)');

  return (
    <div {...props} className={className}>
      <div className="mx-auto my-4 flex w-full grow-0 flex-col rounded bg-surface-light p-2 sm:w-[95%] lg:flex-row dark:bg-surface-dark">
        {/* Login side (desktop:left, mobile:top) */}
        <div className="flex size-full flex-col lg:w-1/2">
          {/* Header */}
          <div className="flex flex-row justify-between max-sm:flex-col max-sm:items-center max-sm:gap-2">
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
            <div className="flex size-fit flex-row items-center gap-2 rounded-lg bg-background-light p-1 dark:bg-background-dark">
              <HeaderSliderLocation label="Login" atPage={isLogin} />
              <HeaderSliderLocation label="Register" atPage={!isLogin} />
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
        {isLgScreen && (
          <div className="my-auto flex h-full w-1/2 justify-center">
          </div>
        )}
      </div>
    </div>
  );
};
export default AuthLayout;
