/**
 * SPDX-FileCopyrightText: 2024 Ng Jun Xiang <contact@ngjx.org>
 *
 * SPDX-License-Identifier: GPL-3.0-only
 */

import * as React from 'react';

const Footer = (): React.ReactNode => {
  return (
    <footer className="bg-accent-dark text-text-dark">
      <div className="mx-auto max-h-full p-4 py-6 md:max-h-48 lg:max-h-64 lg:py-8">
        <div className="md:flex md:justify-between">
          <div className="mb-3 text-center md:mb-0 md:text-left">
            <a href="/" className="flex items-center">
              <span className="mx-auto self-center whitespace-nowrap text-lg font-semibold md:mx-0 md:text-lg lg:text-2xl xl:text-3xl">
                Green Bites SG
              </span>
            </a>
            <p className="self-center text-sm md:text-base xl:text-lg">
              A passion project by a group of students from Nanyang Polytechnic,
              Singapore.
            </p>
          </div>
          <div className="mt-3 grid grid-cols-1 gap-5 md:mr-10 md:mt-8 md:grid-cols-2 md:gap-6 xl:gap-12">
            <div className="mx-auto text-center md:mx-0 md:text-right">
              <h2 className="mb-2 font-normal uppercase md:text-base xl:mb-3 xl:text-lg">
                Legal
              </h2>
              <ul className="text-sm font-thin underline md:text-base xl:text-lg">
                <li className="mb-1">
                  <a href="#">Privacy Policy</a>
                </li>
                <li>
                  <a href="#">Terms &amp; Conditions</a>
                </li>
              </ul>
            </div>
            <div className="mx-auto text-center md:mx-0 md:text-right">
              <h2 className="mb-2 font-normal uppercase md:text-base xl:mb-3 xl:text-lg">
                Contact Us
              </h2>
              <ul className="text-sm font-thin underline md:text-base xl:text-lg">
                <li className="mb-1">
                  <a href="#">Email</a>
                </li>
                <li>
                  <a href="https://github.com/caffeine-addictt/greenbitessg">
                    Github
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className="mt-5">
          <p className="text-center text-xs md:text-left xl:text-sm">
            © Copyright 2024 GreenBitesSG. All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};
export default Footer;
