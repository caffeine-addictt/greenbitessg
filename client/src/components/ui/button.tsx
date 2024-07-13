/**
 * SPDX-FileCopyrightText: 2024 Ng Jun Xiang <contact@ngjx.org>
 *
 * SPDX-License-Identifier: GPL-3.0-only
 */

import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@utils/tailwind';

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 dark:ring-offset-neutral-950 dark:focus-visible:ring-neutral-300',
  {
    variants: {
      variant: {
        default:
          'bg-neutral-900 text-neutral-50 hover:bg-neutral-900/90 dark:bg-neutral-50 dark:text-neutral-900 dark:hover:bg-neutral-50/90',
        destructive:
          'bg-red-500 text-neutral-50 hover:bg-red-500/90 dark:bg-red-900 dark:text-neutral-50 dark:hover:bg-red-900/90',
        outline:
          'border border-neutral-200 bg-white hover:bg-neutral-100 hover:text-neutral-900 dark:border-neutral-800 dark:bg-neutral-950 dark:hover:bg-neutral-800 dark:hover:text-neutral-50',
        secondary:
          'bg-neutral-100 text-neutral-900 hover:bg-neutral-100/80 dark:bg-neutral-800 dark:text-neutral-50 dark:hover:bg-neutral-800/80',
        ghost:
          'hover:bg-neutral-100 hover:text-neutral-900 dark:hover:bg-neutral-800 dark:hover:text-neutral-50',
        link: 'text-neutral-900 underline-offset-4 hover:underline dark:text-neutral-50',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-9 rounded-md px-3',
        lg: 'h-11 rounded-md px-8',
        icon: 'size-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  },
);
Button.displayName = 'Button';

export interface ExternalLinkProps
  extends React.AnchorHTMLAttributes<HTMLAnchorElement>,
    VariantProps<typeof buttonVariants> {
  href: `http://${string}` | `https://${string}`;
}

const ExternalLink = React.forwardRef<HTMLAnchorElement, ExternalLinkProps>(
  ({ className, variant, size, children, ...props }, ref) => {
    return (
      <a
        ref={ref}
        {...props}
        target="_blank"
        rel="noopener noreferrer"
        referrerPolicy="no-referrer-when-downgrade"
        className={cn(buttonVariants({ variant, size, className }))}
      >
        {children}
      </a>
    );
  },
);
ExternalLink.displayName = 'ExternalLink';

export interface InternalLinkProps extends Omit<ExternalLinkProps, 'href'> {
  href: `/${string}`;
  preserveCallback?: boolean;
}
const InternalLink = React.forwardRef<HTMLAnchorElement, InternalLinkProps>(
  (
    {
      className,
      variant,
      size,
      href,
      preserveCallback = false,
      children,
      ...props
    },
    ref,
  ) => {
    const targetURI = new URL(href, location.origin);
    const callback = new URLSearchParams(window.location.search).get(
      'callbackURI',
    );

    if (preserveCallback && callback) {
      targetURI.searchParams.set('callbackURI', callback);
    }

    return (
      <a
        ref={ref}
        {...props}
        href={targetURI.toString()}
        className={cn(buttonVariants({ variant, size, className }))}
      >
        {children}
      </a>
    );
  },
);
InternalLink.displayName = 'InternalLink';

// eslint-disable-next-line
export { Button, ExternalLink, InternalLink, buttonVariants };
