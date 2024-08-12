/**
 * SPDX-FileCopyrightText: 2024 Ng Jun Xiang <contact@ngjx.org>
 *
 * SPDX-License-Identifier: GPL-3.0-only
 */

import { InternalLink } from '@components/ui/button';
import type { PageComponent } from '@pages/route-map';
import { cn } from '@utils/tailwind';

const NotFound: PageComponent = ({ className, ...props }) => {
  return (
    <div
      {...props}
      className={cn(className, 'flex-col gap-2 items-center justify-center')}
    >
      <h1 className="text-4xl font-bold">Page Not Found</h1>
      <p className="text-lg">Sorry, the page you requested was not found.</p>

      <InternalLink href="/" className="mt-20">
        Return Home
      </InternalLink>
    </div>
  );
};
export default NotFound;
