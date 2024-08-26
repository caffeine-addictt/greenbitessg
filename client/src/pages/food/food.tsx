/**
 * SPDX-FileCopyrightText: 2024 Ng Jun Xiang <contact@ngjx.org>
 *
 * SPDX-License-Identifier: GPL-3.0-only
 */

import { useState, Suspense } from 'react';

import * as z from 'zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import httpClient from '@utils/http';
import type { foodGenerateFormSchema } from '@lib/api-types/schemas/food';
import type {
  FoodGenerateSuccessAPI,
  FoodGetSuccessAPI,
} from '@lib/api-types/food';
import type { deleteImageSchema } from '@lib/api-types/schemas/uploadthing';
import type { DeleteUploadThingSuccAPI } from '@lib/api-types/uploadthing';

import { Input } from '@components/ui/input';
import { Button } from '@components/ui/button';
import { PlusIcon } from '@radix-ui/react-icons';
import { Skeleton } from '@components/ui/skeleton';
import type { PageComponent } from '@pages/route-map';

import { generateUploadDropzone } from '@uploadthing/react';
import { getAuthCookie } from '@utils/jwt';
import { cn } from '@utils/tailwind';
import { X } from 'lucide-react';
import { useToast } from '@components/ui/use-toast';
import { isAxiosError } from 'axios';

// Type
type APIParams = Partial<{
  q: string;
  limit: number;
  page: number;
}>;

export const Dropzone = generateUploadDropzone({
  url: `${import.meta.env.VITE_API_BASE_URL}/api/uploadthing`,
});

// Page
const FoodPage: PageComponent = (props) => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const [query, setQuery] = useState<string>(
    new URLSearchParams(window.location.search).get('query') ?? '',
  );
  const [showModal, setShowModal] = useState<boolean>(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [currTimeout, setCurrTimeout] = useState<ReturnType<
    typeof setTimeout
  > | null>(null);

  const buildURI = (params: APIParams): `/${string}` => {
    const currParams = new URLSearchParams(window.location.search);
    params.q = query || currParams.get('query') || '';

    params.page = parseInt(currParams.get('page') ?? '') ?? params.page;
    if (isNaN(params.page) || params.page < 1) params.page = 1;

    params.limit = parseInt(currParams.get('limit') ?? '') ?? params.limit;
    if (isNaN(params.limit) || params.limit < 1) params.limit = 20;

    const newParams = new URLSearchParams();
    for (const [key, value] of Object.entries(params)) {
      if (value) {
        newParams.set(key, value.toString());
      }
    }
    return `${window.location.pathname}?${newParams.toString()}` as `/${string}`;
  };

  // Populate data
  const { refetch, isFetching, data } = useQuery(
    {
      queryKey: ['food'],
      queryFn: () =>
        httpClient
          .get<FoodGetSuccessAPI>({
            uri: buildURI({}),
            withCredentials: 'access',
          })
          .then((res) => res.data)
          .catch((err) => {
            console.log(err);
            toast({
              title: 'Something went wrong',
              description: 'Please try again later',
              variant: 'destructive',
            });
            return [];
          }),
      refetchInterval: 1000 * 60 * 5, // 5 minute
    },
    queryClient,
  );

  // Delete contnet
  const { mutate: deleteContent } = useMutation(
    {
      mutationKey: ['food-delete'],
      mutationFn: (key: string) =>
        httpClient.post<
          DeleteUploadThingSuccAPI,
          z.infer<typeof deleteImageSchema>
        >({
          uri: '/api/delete-uploadthing',
          fromRoot: true,
          payload: { key },
          withCredentials: 'access',
        }),
      onError: (err) => {
        console.log(err);
        toast({
          title: 'Something went wrong',
          description: isAxiosError(err)
            ? err.response?.data.errors[0].message
            : 'Please try again later',
          variant: 'destructive',
        });
      },
    },
    queryClient,
  );

  // Create food
  const { mutate } = useMutation(
    {
      mutationKey: ['food-create'],
      mutationFn: (imageUrl: string) =>
        httpClient
          .post<FoodGenerateSuccessAPI, z.infer<typeof foodGenerateFormSchema>>(
            {
              uri: '/food/generate',
              payload: { image: imageUrl },
              withCredentials: 'access',
            },
          )
          .then(() => undefined),
      onSuccess: () => {
        setShowModal(false);
        refetch();
      },
      onError: (err, url) => {
        // Delete content
        deleteContent(url.replace(/^https:\/\/utfs.io\/f\//, ''));

        // Toast
        toast({
          title: 'Something went wrong',
          description: isAxiosError(err)
            ? err.response?.data.errors[0].message
            : 'Please try again later',
          variant: 'destructive',
        });
      },
    },
    queryClient,
  );

  return (
    <div {...props}>
      <div className="m-4 flex w-screen flex-col gap-2 md:flex-row">
        {/* Left section */}
        <div className="flex w-full flex-col gap-4 px-2 py-5 md:w-1/2">
          {/* Header section (top left) */}
          <div className="mb-16 flex flex-col gap-4">
            <h1 className="text-4xl font-bold">Food</h1>
            <div className="flex flex-col gap-1 text-sm text-text-light/90 dark:text-text-dark/90">
              <p>Learn more and own your eating habits!</p>
              <p>自分の食生活を自分のものにしましょう！</p>
            </div>
          </div>

          {/* Details section */}
          <div className="mx-auto flex w-full flex-col gap-4 rounded-md bg-accent-light px-4 py-2 *:mx-auto *:w-96 md:w-3/4 dark:bg-accent-dark">
            {/* Image section */}
            <h2 className="text-2xl font-bold">Selected Image</h2>
            <div className="size-96 overflow-hidden rounded">
              {data?.length && selectedIndex !== -1 ? (
                <Suspense fallback={<Skeleton className="size-full" />}>
                  <img
                    src={data[selectedIndex].imageUrl}
                    alt=""
                    className="aspect-auto size-full"
                  />
                </Suspense>
              ) : (
                <Skeleton className="size-full" />
              )}
            </div>

            {/* Info section */}
            <h2 className="text-2xl font-bold">Selected Details</h2>
            {data?.length && selectedIndex !== -1 ? (
              <div className="flex flex-col gap-2">
                <p>
                  <span className="text-text-light/90 dark:text-text-dark/90">
                    Name:{' '}
                  </span>
                  {data[selectedIndex].name}
                </p>
                <p>
                  <span className="text-text-light/90 dark:text-text-dark/90">
                    Calories:{' '}
                  </span>
                  {data[selectedIndex].calories}
                </p>
                <p>
                  <span className="text-text-light/90 dark:text-text-dark/90">
                    Serving:{' '}
                  </span>
                  {data[selectedIndex].servingQty} /{' '}
                  {data[selectedIndex].servingUnit}
                </p>
              </div>
            ) : (
              <p className="w-fit">Select an item to display its details</p>
            )}
          </div>
        </div>

        {/* Right section */}
        <div className="flex w-full flex-col gap-4 rounded-lg bg-neutral-200/10 p-10 md:w-1/2 dark:bg-neutral-900/75">
          {/* Search section */}
          <div className="flex flex-row items-center gap-2">
            {/* Search bar */}
            <Input
              placeholder="Search food items..."
              className="w-full lg:w-2/3"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                window.history.pushState(
                  {},
                  '',
                  buildURI({ q: e.target.value }),
                );

                if (currTimeout) clearTimeout(currTimeout);
                setCurrTimeout(setTimeout(() => refetch(), 500));
              }}
            />

            {/* Add button */}
            <Button size="icon" onClick={() => setShowModal(true)}>
              <PlusIcon className="size-6" />
            </Button>
          </div>

          {/* Display section */}
          <div className="flex flex-col gap-1">
            {isFetching ? (
              'Fetching food items...'
            ) : (
              <>
                {data?.length
                  ? data.map((item, i) => (
                      <Button
                        className="flex h-fit w-full flex-col gap-2"
                        disabled={i === selectedIndex}
                        variant={i === selectedIndex ? 'outline' : 'default'}
                        key={`food-item-${item.id}`}
                        onClick={() => setSelectedIndex(i)}
                      >
                        <h3 className="text-2xl font-bold capitalize">
                          {item.name}
                        </h3>

                        <p>
                          <span className="text-xl">{item.calories}J</span>{' '}
                          Calories &nbsp; / &nbsp;
                          {item.servingQty} {item.servingUnit}
                        </p>
                      </Button>
                    ))
                  : 'No food items yet!'}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Modal */}
      <div
        className={cn(
          'left-1/2 -translate-x-1/2 top-1/2 transition-all flex -translate-y-1/2 flex-col items-center justify-center rounded-md bg-neutral-300 drop-shadow',
          {
            absolute: showModal,
            hidden: !showModal,
            'opatity-0': !showModal,
            'opacity-100': showModal,
          },
        )}
      >
        <div className="relative flex size-fit items-center justify-center rounded-lg p-10 ">
          <Dropzone
            endpoint="imageRouter"
            headers={{ Authorization: `Bearer ${getAuthCookie('access')}` }}
            onUploadBegin={() =>
              toast({
                title: 'Uploading...',
                description: 'Please wait... This may take a while',
              })
            }
            onClientUploadComplete={(res) => {
              mutate(res[0].url);
            }}
            onUploadError={(err) => {
              console.log(err);
              toast({
                title: 'Something went wrong',
                description: err.message ?? 'Please try again later',
                variant: 'destructive',
              });
            }}
          />

          {/* Close button */}
          <Button
            onClick={() => setShowModal(false)}
            className="absolute right-1 top-1"
            size="icon"
            variant="ghost"
          >
            <X className="size-6 text-red-500 drop-shadow" />
          </Button>
        </div>
      </div>
    </div>
  );
};
export default FoodPage;
