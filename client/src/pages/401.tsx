/**
 * SPDX-FileCopyrightText: 2024 Ng Jun Xiang <contact@ngjx.org>
 *
 * SPDX-License-Identifier: GPL-3.0-only
 */

import type { PageComponent } from '@pages/route-map';

import { cn } from '@utils/tailwind';
import { InternalLink } from '@components/ui/button';

const Unauthorized: PageComponent = ({ className, ...props }) => {
  return (
    <div
      {...props}
      className={cn(className, 'flex-col gap-2 items-center justify-center')}
    >
      <h1 className="text-4xl font-bold">Unauthorized</h1>
      <p className="text-2xl">You are not authorized to access this page.</p>

      <InternalLink href="/" className="mt-20">
        Return Home
      </InternalLink>
    </div>
  );
};
export default Unauthorized;
