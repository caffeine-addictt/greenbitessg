/**
 * SPDX-FileCopyrightText: 2024 Ng Jun Xiang <contact@ngjx.org>
 *
 * SPDX-License-Identifier: GPL-3.0-only
 */

import type { PageComponent } from '@pages/route-map';
import { InternalLink } from '@components/ui/button';

const RootPage: PageComponent = (props) => {
  return (
    <div {...props} className="mb-10 flex-col items-center">
      <div className="relative text-text-light">
        <img
          src="/lcp-screen-1366x600.webp"
          className="h-full min-w-full object-fill"
          loading="eager"
          height="600"
        ></img>
        <div className="absolute bottom-6 left-1 mb-4 md:bottom-1/3 md:left-10 lg:bottom-1/2">
          <h1 className="text-2xl font-bold md:text-4xl lg:text-6xl">
            GreenBites <span className="text-green-700">SG</span>
          </h1>
          <InternalLink
            href="/register"
            variant="secondary"
            size="default"
            className="!bg-primary-light"
          >
            Start Now
          </InternalLink>
        </div>
      </div>

      <div className="container mx-auto mt-16 flex-col">
        <h1 className="text-center text-2xl font-bold ">About Us</h1>
        <div className="mt-8 flex flex-col items-center gap-10 md:flex-row">
          <img
            src="/sustainability-image2-1445x813.webp"
            className="size-full md:w-1/2"
            loading="lazy"
            height="813"
          ></img>
          <div className="mt-4 w-full md:ml-0 md:mt-0 md:w-1/2 ">
            <h3 className="text-center text-2xl"> What is GreenBitesSG?</h3>
            <p className="mt-3">
              Here at GreenBitesSG we are a nation wide movement that focuses on
              fighting food wastage, to advance Singapore's national agenda on
              sustainable development by giving you a platform to learn and
              practice sustainable food habits.
            </p>
          </div>
        </div>
        <div className="mt-8 flex flex-col items-center gap-10 md:flex-row-reverse">
          <img
            src="/sustainability-image3-1600x900.webp"
            className="size-full md:w-1/2"
            loading="lazy"
            height="900"
          ></img>
          <div className="mt-4 w-full md:ml-0 md:mt-0 md:w-1/2">
            <h3 className="text-center text-2xl">
              Why is GreenBitesSG important?
            </h3>
            <p className="mt-7">
              Food Wastage is a global challenge and every second counts in this
              problem, we have to make every one of our actions count, and take
              firm actions to do our part for Singapore to reduce food wastage.
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto mt-20">
        <h1 className="mb-8 text-center text-2xl font-bold">Our Partners</h1>
        <div className="mb-3 flex flex-col items-center justify-center space-y-4 md:flex-row md:gap-32">
          <img
            src="/SFA-logo-200x93.webp"
            className="mb-10 h-full md:m-0"
            alt=""
            loading="lazy"
            height="93"
          ></img>
          <img
            src="/NEA-logo-400x181.webp"
            className="mt-10 h-full w-60 md:m-0"
            alt=""
            loading="lazy"
            height="181"
          ></img>
        </div>
      </div>

      <div className="container mx-auto mt-20">
        <h1 className="text-center text-2xl font-bold">Start Now</h1>
        <div className="mt-8 flex flex-col items-center gap-10 md:flex-row">
          <img
            src="/sustainability-1000x562.webp"
            className="size-full md:w-1/2"
            alt=""
            loading="lazy"
            height="562"
          ></img>
          <div className="mt-4 w-full md:ml-0 md:mt-0 md:w-1/2">
            <p className="mb-4">
              So what are you waiting for? Food wastage won't wait for you so
              join us and the community in combatting food wastage!
            </p>
            <InternalLink
              href="/register"
              variant="secondary"
              size="default"
              className="!bg-primary-light"
            >
              Start Now
            </InternalLink>
          </div>
        </div>
      </div>
    </div>
  );
};
export default RootPage;
