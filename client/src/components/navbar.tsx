/**
 * SPDX-FileCopyrightText: 2024 Ng Jun Xiang <contact@ngjx.org>
 *
 * SPDX-License-Identifier: GPL-3.0-only
 */

import * as React from 'react';
import { AuthContext } from '@service/auth';
import { Button, InternalLink } from '@components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from '@components/ui/dropdown-menu';
import { BellIcon, HamburgerMenuIcon } from '@radix-ui/react-icons';
import { PageComponent } from '@pages/route-map';

const Navbar: PageComponent = (): React.JSX.Element => {
  const { isAdmin } = React.useContext(AuthContext)!;
  return (
    <nav className="bg-accent-dark">
      <div className="mx-auto flex h-16 max-w-screen-xl flex-wrap items-center justify-between p-4">
        <a href="/" className="flex items-center space-x-3 rtl:space-x-reverse">
          <img src="/logo_279x279.webp" className="h-8" alt="Logo" />
          <span className="self-center whitespace-nowrap text-2xl font-semibold">
            Green Bites SG
          </span>
        </a>
        <div className="flex space-x-3 md:order-2 md:space-x-1 rtl:space-x-reverse">
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Button className="size-10 items-center !bg-primary-dark p-2 text-center">
                <HamburgerMenuIcon />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="block w-80 rounded border-none !bg-primary-dark !text-text-light !no-underline md:w-60 md:p-1 md:text-sm">
              <DropdownMenuItem className="focus:bg-primary-dark-200 dark:focus:bg-primary-dark-200">
                <InternalLink
                  href="/"
                  aria-current="page"
                  className="m-0 p-0 !text-text-light !no-underline"
                  variant={'link'}
                >
                  Home
                </InternalLink>
              </DropdownMenuItem>
              <DropdownMenuItem className="focus:bg-primary-dark-200 dark:focus:bg-primary-dark-200">
                <InternalLink
                  href="/about"
                  className="m-0 p-0 !text-text-light !no-underline"
                  variant={'link'}
                >
                  About
                </InternalLink>
              </DropdownMenuItem>
              <DropdownMenuItem className="focus:bg-primary-dark-200 dark:focus:bg-primary-dark-200">
                <InternalLink
                  href="/home"
                  className="m-0 p-0 !text-text-light !no-underline"
                  variant={'link'}
                >
                  My Account
                </InternalLink>
              </DropdownMenuItem>
              <DropdownMenuItem className="focus:bg-primary-dark-200 dark:focus:bg-primary-dark-200">
                <InternalLink
                  href="/food-tips"
                  className="m-0 p-0 !text-text-light !no-underline"
                  variant={'link'}
                >
                  Today's Sustainable Food Tips
                </InternalLink>
              </DropdownMenuItem>
              <DropdownMenuItem className="focus:bg-primary-dark-200 md:hidden dark:focus:bg-primary-dark-200">
                <InternalLink
                  href="/my-events"
                  className="m-0 p-0 !text-text-light !no-underline md:hidden"
                  variant={'link'}
                >
                  My Events
                </InternalLink>
              </DropdownMenuItem>
              {isAdmin && (
                <>
                  <DropdownMenuLabel>Admin</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="focus:bg-primary-dark-200 dark:focus:bg-primary-dark-200">
                    <InternalLink
                      href="/dashboard"
                      className="m-0 p-0 !text-text-light !no-underline"
                      variant={'link'}
                    >
                      Dashboard
                    </InternalLink>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="focus:bg-primary-dark-200 dark:focus:bg-primary-dark-200">
                    <InternalLink
                      href="/events"
                      className="m-0 p-0 !text-text-light !no-underline"
                      variant={'link'}
                    >
                      Event Management
                    </InternalLink>
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Button className="size-10 items-center !bg-primary-dark p-2 text-center">
                <BellIcon />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="h-52 w-60 !min-w-full border-none !bg-primary-dark text-base md:p-2 md:text-sm">
              <DropdownMenuItem className="!text-text-light focus:bg-primary-dark-200 dark:focus:bg-primary-dark-200">
                Notification Item
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <InternalLink
            href="/my-events"
            variant={'link'}
            className="hidden items-center justify-center rounded-md bg-primary-dark p-2 text-center text-sm !text-text-light !no-underline md:inline-flex"
          >
            My Events
          </InternalLink>
        </div>
      </div>
    </nav>
  );
};
export default Navbar;
