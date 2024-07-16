/**
 * SPDX-FileCopyrightText: 2024 Ng Jun Xiang <contact@ngjx.org>
 *
 * SPDX-License-Identifier: GPL-3.0-only
 */

import * as React from 'react';

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
          <button
            data-collapse-toggle="navbar-dropdown"
            type="button"
            className="inline-flex size-9 items-center justify-center rounded-md bg-primary-dark p-2 text-sm text-text-light"
            aria-controls="navbar-cta"
            aria-expanded="false"
          >
            <span className="sr-only"></span>
            <img src="/dropdown.svg"></img>
          </button>
          <a
            href="#"
            className="hidden size-9 items-center justify-center rounded-md bg-primary-dark p-2 text-center text-base font-medium md:inline-flex"
          >
            <img src="/notificationBell.svg"></img>
          </a>
          <a
            href="#"
            className="hidden items-center justify-center rounded-md bg-primary-dark p-2 text-center text-sm text-text-light md:inline-flex"
          >
            My Events
          </a>
        </div>
        <div
          className="flex w-full items-center justify-between text-center md:order-1 md:hidden md:w-auto"
          id="navbar-dropdown"
        >
          <ul className="mt-4 flex flex-col rounded-lg p-4 font-medium">
            <li>
              <a
                href="#"
                className="block px-3 py-2 md:p-0"
                aria-current="page"
              >
                Home
              </a>
            </li>
            <li>
              <a href="#" className="block rounded px-3 py-2 md:p-0">
                About
              </a>
            </li>
            <li>
              <a href="#" className="block rounded px-3 py-2 md:p-0">
                My Account
              </a>
            </li>
            <li>
              <a href="#" className="block rounded px-3 py-2 md:p-0">
                Today's Sustainable Food Tips
              </a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};
export default Navbar;
