/**
 * SPDX-FileCopyrightText: 2024 Ng Jun Xiang <contact@ngjx.org>
 *
 * SPDX-License-Identifier: GPL-3.0-only
 */

import * as React from 'react';
import { useLocation } from 'react-router-dom';

import Autoplay from 'embla-carousel-autoplay';
import {
  Carousel,
  type CarouselApi,
  CarouselContent,
  CarouselItem,
} from '@components/ui/carousel';

import { cn } from '@utils/tailwind';
import { Image } from '@components/ui/image';
import { Button, InternalLink } from '@components/ui/button';
import { useMediaQuery } from '@components/hooks';

// Constants
type ImageType = {
  name: `/${string}`;
  ext: 'png' | 'jpg';
  sizes: `${number}x${number}`[];
  default: number;
  className?: string;
};
const images: ImageType[] = [
  {
    name: '/cooking-class',
    ext: 'png',
    sizes: ['1414x2000', '707x1000', '354x500'],
    default: 0,
    className: 'max-w-[99.9%]',
  },
  {
    name: '/food-drive',
    ext: 'png',
    sizes: ['1414x2000', '707x1000', '354x500'],
    default: 0,
  },
  {
    name: '/menu-item',
    ext: 'png',
    sizes: ['1414x2000', '707x1000', '354x500'],
    default: 0,
  },
] as const;

// Components
export interface AuthLayoutProps extends React.HTMLProps<HTMLDivElement> {
  title?: string;
  subTitle?: string | React.ReactNode;
}
export const AuthLayout = ({
  title = 'Green Bites SG',
  subTitle = 'Welcome to Green Bites',
  className,
  children,
  ...props
}: AuthLayoutProps) => {
  const location = useLocation();
  location.pathname = location.pathname.replace(/\/+$/, '');

  const isLogin = location.pathname.endsWith('/login');
  const isLoginOpts = location.pathname === '/login';
  const isRegisterOpts = location.pathname === '/register';
  const isLgScreen = useMediaQuery('(min-width: 1024px)');

  // For start/stop autoplay
  const plugin = React.useRef(
    Autoplay({ delay: 10000, stopOnInteraction: false }),
  );

  // For disabling/enabling dots
  const [api, setApi] = React.useState<CarouselApi>();
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const onSelect = React.useCallback(
    (event: CarouselApi) => setCurrentIndex(event!.selectedScrollSnap()),
    [],
  );

  React.useEffect(() => {
    if (!api) return;

    onSelect(api);
    api.on('select', onSelect);
  }, [api, onSelect]);

  return (
    <div {...props} className={className}>
      <div className="bg-surface-light dark:bg-surface-dark mx-auto my-4 flex w-[95%] grow-0 flex-col rounded p-2 lg:flex-row">
        {/* Login side (desktop:left, mobile:top) */}
        <div className="flex size-full flex-col lg:w-3/5">
          {/* Header */}
          <div className="mb-10 flex flex-row justify-between max-sm:flex-col max-sm:items-center max-sm:gap-6">
            {/* Left */}
            <div className="flex flex-col gap-2">
              {/* Logo */}
              <div className="flex flex-row items-center gap-4">
                <img
                  src=""
                  alt=""
                  width={32}
                  height={32}
                  className="size-12 rounded-full"
                />
                <h1 className="text-3xl font-bold">{title}</h1>
              </div>

              {/* Sub title */}
              <p className="ml-2 text-sm max-sm:text-center">{subTitle}</p>
            </div>

            {/* Slider */}
            <div className="bg-background-light dark:bg-background-dark flex size-fit flex-row items-center gap-2 rounded-lg p-1 max-sm:hidden">
              <InternalLink
                href="/login"
                disabled={isLoginOpts}
                variant={isLogin ? 'secondary' : 'default'}
              >
                Login
              </InternalLink>
              <InternalLink
                href="/register"
                disabled={isRegisterOpts}
                variant={isLogin ? 'default' : 'secondary'}
              >
                Register
              </InternalLink>
            </div>
          </div>

          {/* Body content */}
          <div className="flex grow flex-col items-center">{children}</div>

          {/* Footer */}
          <div className="mt-10 flex flex-col text-sm max-sm:items-center max-sm:text-center">
            {isLogin ? (
              <span>
                Or{' '}
                <InternalLink
                  className="h-fit p-0"
                  variant="link"
                  href="/register"
                  preserveCallback
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
          <div className="my-auto flex h-full w-2/5 justify-center">
            <div className="bg-surface-light/5 relative m-2 flex h-fit w-[90%] items-center justify-center self-center rounded-lg">
              <Carousel
                setApi={setApi}
                className="my-4 mr-4 size-fit"
                opts={{
                  align: 'start',
                  loop: true,
                }}
                plugins={[plugin.current]}
              >
                <CarouselContent className="mx-0 size-full">
                  {images.map((imgType, index) => (
                    <CarouselItem
                      className="basis-full"
                      key={`carousel-item-${index}`}
                    >
                      <Image
                        src={`${imgType.name}-${imgType.sizes[imgType.default]}.${imgType.ext}`}
                        srcSet={imgType.sizes
                          .map(
                            (size, i) =>
                              `${imgType.name}-${size}.${imgType.ext} ${1 + 1.5 * i}x`,
                          )
                          .join(', ')}
                        alt=""
                        loading={index === 0 ? 'eager' : 'lazy'}
                        className={cn('size-full rounded', imgType.className)}
                      />
                    </CarouselItem>
                  ))}
                </CarouselContent>
              </Carousel>

              {/* Dots navigation */}
              <div className="absolute bottom-6 left-6 flex flex-row gap-1">
                {images.map((_, index) => (
                  <Button
                    key={`carousel-dot-${index}`}
                    className={cn(
                      'm-0 size-4 rounded-full bg-surface-light/30 p-0',
                      { 'bg-surface-light/5': index === currentIndex },
                    )}
                    disabled={index === currentIndex}
                    onClick={() =>
                      api?.scrollTo(index) && plugin.current.reset()
                    }
                  />
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
export default AuthLayout;
