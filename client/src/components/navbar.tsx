/**
 * SPDX-FileCopyrightText: 2024 Ng Jun Xiang <contact@ngjx.org>
 *
 * SPDX-License-Identifier: GPL-3.0-only
 */

import * as React from 'react';
import { useToast } from '@components/ui/use-toast';
import { AuthContext } from '@service/auth';
import type { PageComponent } from '@pages/route-map';

import httpClient from '@utils/http';
import { isAxiosError } from 'axios';
import { useQuery, useMutation } from '@tanstack/react-query';
import type {
  GetNotificationSuccAPI,
  NotificationArchiveSuccAPI,
} from '@lib/api-types/notification';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from '@components/ui/dropdown-menu';
import { Button, InternalLink, buttonVariants } from '@components/ui/button';
import {
  ArchiveIcon,
  BellIcon,
  HamburgerMenuIcon,
} from '@radix-ui/react-icons';
import { cn } from '@utils/tailwind';
import type { DropdownMenuProps } from '@radix-ui/react-dropdown-menu';

// Components
export const NavbarLink = ({
  href,
  children,
  className = '',
}: DropdownMenuProps & { className?: string; href: `/${string}` }) => (
  <DropdownMenuItem asChild>
    <InternalLink
      href={href}
      className={cn('justify-start', className)}
      variant="link"
    >
      {children}
    </InternalLink>
  </DropdownMenuItem>
);

const Navbar: PageComponent = (): React.JSX.Element => {
  const { toast } = useToast();
  const { isAdmin, isLoggedIn } = React.useContext(AuthContext)!;

  // Fetch user notifications
  const {
    data: notifications,
    refetch,
    isError,
  } = useQuery({
    queryKey: ['notifications-get'],
    queryFn: () =>
      httpClient
        .get<GetNotificationSuccAPI>({
          uri: '/notification',
          withCredentials: 'access',
        })
        .then((res) => res.data),
    enabled: isLoggedIn,
  });

  // Archive user notifications
  const { mutate: archive } = useMutation({
    mutationKey: ['notifications-archive'],
    mutationFn: (id: number) =>
      httpClient.post<NotificationArchiveSuccAPI, { ignore: string }>({
        uri: `/notification/archive/${id}`,
        withCredentials: 'access',
      }),
    onSuccess: () => {
      toast({
        title: 'Notification archived',
        description: 'Your notification has been archived.',
      });
      refetch();
    },
    onError: (err) => {
      console.log(err);
      toast({
        title: 'Something went wrong',
        description: isAxiosError(err)
          ? err.response?.data.errors[0].message
          : 'Please try again later',
        variant: 'destructive',
      });
    },
  });

  return (
    <nav className="bg-accent-dark">
      <div className="mx-auto flex h-16 max-w-screen-xl flex-wrap items-center justify-between p-4">
        {/* Logo */}
        <InternalLink href="/" variant="link">
          <img src="/logo_279x279.webp" className="mr-2 size-8" alt="Logo" />
          <span className="self-center whitespace-nowrap text-2xl font-semibold max-sm:hidden">
            Green Bites SG
          </span>
        </InternalLink>

        {/* Right */}
        <div className="flex space-x-3 md:order-2 md:space-x-1 rtl:space-x-reverse">
          <InternalLink href="/events" className="hidden md:inline-flex">
            Events
          </InternalLink>

          {/* Settings */}
          {isLoggedIn && (
            <InternalLink href="/settings" className="hidden md:inline-flex">
              Settings
            </InternalLink>
          )}

          {/* Notification */}
          {isLoggedIn && (
            <DropdownMenu>
              <DropdownMenuTrigger className={buttonVariants({ size: 'icon' })}>
                <BellIcon className="size-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent className="h-52 w-60 border-none text-base md:p-2 md:text-sm">
                <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                <DropdownMenuSeparator />

                {/* Load notifications */}
                {notifications &&
                  notifications.length > 0 &&
                  notifications.map((notification, i) => (
                    <DropdownMenuItem
                      className="flex-row items-start"
                      key={`notification-${i}`}
                    >
                      {/* left */}
                      <div className="flex w-fit flex-col gap-2">
                        <p>{notification.notificationMessage}</p>
                        <p className="text-sm">
                          {notification.createdAt.toLocaleDateString()}
                        </p>
                      </div>

                      {/* Right */}
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => archive(notification.id)}
                      >
                        <ArchiveIcon className="size-4" />
                      </Button>
                    </DropdownMenuItem>
                  ))}

                {/* if no notifications */}
                {notifications && !notifications.length && (
                  <DropdownMenuItem className="flex-row items-start">
                    <p className="text-sm">No notifications</p>
                  </DropdownMenuItem>
                )}

                {/* if error */}
                {isError && (
                  <DropdownMenuItem className="flex-row items-start">
                    <p className="text-sm">Something went wrong</p>
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          {/* Login */}
          {!isLoggedIn && (
            <InternalLink href="/login" className="hidden md:inline-flex">
              Login/Register
            </InternalLink>
          )}

          {/* Hamburger */}
          <DropdownMenu>
            <DropdownMenuTrigger className={buttonVariants({ size: 'icon' })}>
              <HamburgerMenuIcon className="size-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="*:focus:bg-current/90 block w-80 rounded border-none md:w-60 md:p-1 md:text-sm">
              {/* Global links */}
              <NavbarLink href="/">Home</NavbarLink>
              <NavbarLink href="/home">My Account</NavbarLink>
              <NavbarLink href="/events">Events</NavbarLink>
              <NavbarLink href="/food">My Eaten Foods</NavbarLink>

              {/* Admin only links */}
              {isAdmin && (
                <>
                  <DropdownMenuSeparator />
                  <NavbarLink href="/dashboard">Admin Dashboard</NavbarLink>
                </>
              )}

              <DropdownMenuSeparator />

              {/* login */}
              {!isLoggedIn && (
                <NavbarLink href="/login" className="hidden max-md:flex">
                  Login/Register
                </NavbarLink>
              )}

              {/* logout */}
              {isLoggedIn && (
                <>
                  <NavbarLink href="/settings" className="hidden max-md:flex">
                    Settings
                  </NavbarLink>
                  <NavbarLink href="/logout">Logout</NavbarLink>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </nav>
  );
};
export default Navbar;
