/**
 * SPDX-FileCopyrightText: 2024 Ng Jun Xiang <contact@ngjx.org>
 *
 * SPDX-License-Identifier: GPL-3.0-only
 */

import * as React from 'react';
import { AuthContext } from '@service/auth';
import type { PageComponent } from '@pages/route-map';

const Home: PageComponent = (props) => {
  const { user } = React.useContext(AuthContext)!;

  return (
    <div {...props} className="mb-7 mt-3">
      <div className="mx-auto max-w-7xl overflow-hidden rounded-lg">
        <div className="mx-auto my-10 flex flex-col items-center space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
          <img className="size-24 rounded-full sm:mr-8"></img>
          <h2 className="text-4xl font-bold">Hello, {user?.username}!</h2>
        </div>
        <div className="mb-7 mt-8 grid grid-cols-1 gap-7 p-1 text-center text-lg md:grid-cols-2 dark:text-text-light">
          <div className="p-6">
            <a href="/" className="block bg-primary-dark">
              <img src=""></img>
              <p className="p-6 font-semibold">View Upcoming events</p>
            </a>
          </div>
          <div className="p-6">
            <a href="/feedback" className="block bg-primary-dark">
              <img src=""></img>
              <p className="p-6 font-semibold">Provide Your Feedback</p>
            </a>
          </div>
          <div className="p-6">
            <a href="/my-events" className="block bg-primary-dark">
              <img src=""></img>
              <p className="p-6 font-semibold">My Events</p>
            </a>
          </div>
          <div className="p-6">
            <a href="/settings" className="block bg-primary-dark">
              <img src=""></img>
              <p className="p-6 font-semibold">My Account</p>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
