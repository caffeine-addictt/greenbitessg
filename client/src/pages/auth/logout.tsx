/**
 * SPDX-FileCopyrightText: 2024 Ng Jun Xiang <contact@ngjx.org>
 *
 * SPDX-License-Identifier: GPL-3.0-only
 */

import * as React from 'react';
import { Navigate } from 'react-router-dom';

import type { PageComponent } from '@pages/route-map';
import { cn } from '@utils/tailwind';
import { AuthContext } from '@service/auth';

const LogoutPage: PageComponent = ({ className, ...props }) => {
  const { logout, isLoggedIn } = React.useContext(AuthContext)!;
  const [done, setDone] = React.useState(false);

  React.useEffect(() => {
    (async () => await logout())();
    setDone(true);
  }, [logout]);

  if (isLoggedIn || done) {
    return <Navigate to={'/'} replace />;
  }

  return (
    <div {...props} className={cn(className, 'justify-center items-center')}>
      Logging out...
    </div>
  );
};
export default LogoutPage;
