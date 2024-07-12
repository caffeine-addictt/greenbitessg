/**
 * SPDX-FileCopyrightText: 2024 Ng Jun Xiang <contact@ngjx.org>
 *
 * SPDX-License-Identifier: GPL-3.0-only
 */

import * as React from 'react';
import { Suspense } from 'react';

import { Skeleton } from './skeleton';

export interface ImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {}

const Image = React.forwardRef<HTMLImageElement, ImageProps>(
  ({ className, ...props }, ref) => {
    return (
      <Suspense fallback={<Skeleton className={'h-screen w-screen'} />}>
        <img className={className} ref={ref} {...props} />
      </Suspense>
    );
  },
);
Image.displayName = 'Image';

export { Image };
