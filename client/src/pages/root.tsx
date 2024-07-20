/**
 * SPDX-FileCopyrightText: 2024 Ng Jun Xiang <contact@ngjx.org>
 *
 * SPDX-License-Identifier: GPL-3.0-only
 */

import type { PageComponent } from '@pages/route-map';
import { Button } from '@components/ui/button';

const RootPage: PageComponent = (props) => {
  return (
    <div {...props} className="flex-col items-center">
      <div className="container">
        <div className=""></div>
      </div>

      <div className="container mx-auto mt-16 flex-col">
        <h1 className="text-center text-2xl font-bold ">About Us</h1>
        <div className="mt-8 flex flex-col items-center md:flex-row">
          <img className="w-full md:w-1/2" alt=""></img>
          <div className="mt-4 w-full md:ml-0 md:mt-0 md:w-1/2">
            <h3 className="text-center text-2xl"> What is GreenBitesSG?</h3>
            <p className="mt-3">
              Here at GreenBitesSG we are a nation wide movement that focuses on
              fighting food wastage, to advance Singapore's national agenda on
              sustainable development by giving you a platform to learn and
              practice sustainable food habits.
            </p>
          </div>
        </div>
        <div className="mt-8 flex flex-col items-center md:flex-row-reverse">
          <img className="w-full md:w-1/2" alt=""></img>
          <div className="mt-4 w-full md:ml-0 md:mt-0 md:w-1/2">
            <h3 className="text-center text-2xl">
              {' '}
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
        <h1 className="text-center text-2xl font-bold">Our Partners</h1>
        <div className="flex flex-col items-center md:flex-row">
          <img className="w-full md:w-1/2" alt=""></img>
          <img className="w-full md:w-1/2" alt=""></img>
        </div>
      </div>

      <div className="container mx-auto mt-20">
        <h1 className="text-center text-2xl font-bold">Start Now</h1>
        <div className="mt-8 flex flex-col items-center md:flex-row">
          <img className="w-full md:w-1/2" alt=""></img>
          <div className="mt-4 w-full md:ml-0 md:mt-0 md:w-1/2">
            <p className="mb-4">
              So what are you waiting for? Food wastage won't wait for you so
              join us and the community in combatting food wastage!
            </p>
            <a href="/register" className="flex justify-center">
              <Button variant="secondary" size="default">
                Start Now
              </Button>
            
            </a>
          </div>
        </div>
      </div>  
    </div>
  );
};
export default RootPage;
