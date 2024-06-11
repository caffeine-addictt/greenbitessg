/**
 * SPDX-FileCopyrightText: 2024 Ng Jun Xiang <contact@ngjx.org>
 *
 * SPDX-License-Identifier: GPL-3.0-only
 */

import type { PageComponent } from '@pages/route-map';

const RootPage: PageComponent = (props) => {
  return <div {...props} className="flex-col items-center">

    <div className="container">
      <h1 className="text-2xl font-bold text-center">About Us</h1>
      <div className="flex flex-col md:flex-row items-center">
        <img className="w-full md:w-1/2" alt=""></img>
        <div className='mt-4 md:mt-0 md:ml-0'>
          <h3 className='text-2xl'> What is GreenBitesSG?</h3>
          <p>Here at GreenBitesSG we are a nation wide movement that focuses on fighting food wastage, to advance
            Singapore's national agenda on sustainable development by giving you a platform to learn and
            practice sustainable food habits.
          </p>
        </div>
      </div>
      <div className="flex flex-col md:flex-row-reverse items-center">
        <img className="w-full md:w-1/2" alt=""></img>
        <div className='mt-4 md:mt-0 md:ml-0'>
          <h3 className='text-2xl'> Why is GreenBitesSG important?</h3>
          <p>Food Wastage is a global challenge, and we have to take firm actions to do our part
             for Singapore to reduce food wastage.
          </p>
        </div>
      </div>
    </div>

    <div className="container">
      <h1 className="text-2xl font-bold text-center">Our Partners</h1>
    </div>

    <div className="container">
      <h1 className="text-2xl font-bold text-center">Start Now</h1>
      <div className="flex flex-col md:flex-row items-center">
        <img className="w-full md:w-1/2" alt=""></img>
        <div className='mt-4 md:mt-0 md:ml-0'>
          <h3 className='text-2xl'></h3>
          <p>
          </p>
        </div>
      </div>
    </div>
  </div>;
};
export default RootPage;
