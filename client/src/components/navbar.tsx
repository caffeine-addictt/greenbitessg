/**
 * SPDX-FileCopyrightText: 2024 Ng Jun Xiang <contact@ngjx.org>
 *
 * SPDX-License-Identifier: GPL-3.0-only
 */

import * as React from 'react';
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const Navbar = (): React.ReactNode => {
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
              <Button className='!bg-primary-dark size-9 items-center text-center p-2'><img src="/dropdown.svg"></img></Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className='!bg-primary-dark block rounded !text-text-light md:text-sm px-2 py-1 md:p-2 border-none w-80 md:w-60'>
              <DropdownMenuItem><a href="/" aria-current="page">Home</a></DropdownMenuItem>
              <DropdownMenuItem><a href="#">About</a></DropdownMenuItem>
              <DropdownMenuItem><a href="/home">My Account</a></DropdownMenuItem>
              <DropdownMenuItem><a href="#">Today's Sustainable Food Tips</a></DropdownMenuItem>
              <DropdownMenuItem className="md:hidden"><a href="/my-events" className="md:hidden">My Events</a></DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Button className='!bg-primary-dark size-9 items-center text-center p-2'><img src="/notificationBell.svg"></img></Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className='!bg-primary-dark h-52 w-60 !text-text-light text-base md:text-sm border-none !min-w-full py-3 px-2'>
              <DropdownMenuItem>Notification Item</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <a
            href="/my-events"
            className="hidden items-center justify-center rounded-md bg-primary-dark p-2 text-center text-sm text-text-light md:inline-flex"
          >
            My Events
          </a>
        </div>
      </div>
    </nav>
  );
};
export default Navbar;
