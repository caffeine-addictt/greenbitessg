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
import type { DropdownMenuProps } from '@radix-ui/react-dropdown-menu';

// Components
export const NavbarLink = ({
  href,
  children,
}: DropdownMenuProps & { href: `/${string}` }) => (
  <DropdownMenuItem asChild>
    <InternalLink href={href} className="justify-start" variant="link">
      {children}
    </InternalLink>
  </DropdownMenuItem>
);

const Navbar: PageComponent = (): React.JSX.Element => {
  const { isAdmin } = React.useContext(AuthContext)!;
  return (
    <nav className="bg-accent-dark">
      <div className="mx-auto flex h-16 max-w-screen-xl flex-wrap items-center justify-between p-4">
        {/* Logo */}
        <InternalLink href="/" variant='link'>
          <img src="/logo_279x279.webp" className="mr-2 size-8" alt="Logo" />
          <span className="self-center whitespace-nowrap text-2xl font-semibold">
            Green Bites SG
          </span>
        </InternalLink>

        {/* Right */}
        <div className="flex space-x-3 md:order-2 md:space-x-1 rtl:space-x-reverse">
          <InternalLink
            href="/events"
            className="hidden md:inline-flex"
          >
            Events
          </InternalLink>

          {/* Notification */}
          <DropdownMenu>
            <DropdownMenuTrigger className={buttonVariants({ size: 'icon' })}>
              <BellIcon className="size-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="h-52 w-60 border-none text-base md:p-2 md:text-sm">
              <DropdownMenuItem>
                Notification Item
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

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
                  <DropdownMenuLabel>Admin</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <NavbarLink href="/dashboard">Dashboard</NavbarLink>
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
