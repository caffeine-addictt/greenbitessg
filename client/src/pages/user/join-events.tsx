/**
 * SPDX-FileCopyrightText: 2024 Ng Jun Xiang <contact@ngjx.org>
 *
 * SPDX-License-Identifier: GPL-3.0-only
 */

import { z } from 'zod';
import { useEffect, useState } from 'react';

import { PageComponent } from '@pages/route-map';
import httpClient from '@utils/http';
import { eventSchema } from '@lib/api-types/schemas/event';
import { useParams } from 'react-router-dom';
import { useMediaQuery } from '@components/hooks';
import { Button } from '@components/ui/button';
import { Image } from '@components/ui/image';

// Define the Event type using z.infer and eventSchema
type Event = z.infer<typeof eventSchema>;

// finding the specific event based on id
const EventJoin: PageComponent = () => {
  const { id } = useParams();
  const [events, setEvents] = useState<Event[]>([]);
  const [error, setError] = useState<string | null>(null);
  const isMdScreen = useMediaQuery('(min-width: 768px)');

  useEffect(() => {
    const getEvent = async (id: number) => {
      try {
        const response = await httpClient.get<{ data: Event[] }>({
          uri: `/event/${id}`,
          withCredentials: 'access',
        });

        // retrieve events
        setEvents(response.data);
      } catch (err) {
        setError('Error retrieveing event! Please try again later.');
        console.error('Fetching error:', err);
      }
    };

    getEvent(parseInt(id!));
  }, []);

  return (
    <div className="container mx-auto mt-16">
      <h1 className="text-center text-2xl font-bold">Event Details</h1>
      {error && <p className="text-red-500">{error}</p>}
      {events.length > 0 ? (
        <div className='h-full mb-5'>
          {events.map((event) => (
            <>
              <div key={event.id} className='grid grid-cols-1 md:grid-cols-2 mt-10'>
                {isMdScreen && (
                  <div className="relative py-52 flex h-1/2 md:h-full w-[95%] justify-center bg-surface-light/5">
                    {/* To include: images once value is added (desktop:left, mobile:hidden) */}
                    <Image></Image>
                    <h1 className='absolute underline text-2xl bottom-5 left-5'>{event.title}</h1>
                  </div>
                )}
                <div className="relative mx-auto flex w-[95%] grow-0 flex-col rounded items-center lg:flex-row">
                  <div className="absolute w-full h-full flex-col top-0 mx-auto items-center justify-center ">
                    <h1 className='md:hidden text-xl'>Event Name: {event.title}</h1>
                    <p className='mb-5'>Description: {event.description}</p>
                    <p>Date: {`${event.date}`}</p>
                    <p>Time: {`${event.time}`}</p>
                    <p>Location: {event.location}</p>
                    <Button variant="default" className='md:absolute px-6 py-5 bottom-0 md:right-1/2 mt-5'>
                      Join
                    </Button>
                  </div>
                </div>
              </div>
            </>
          ))}
        </div>
      ) : (
        <p>Event Not found</p>
      )}
    </div>
  );
};
export default EventJoin;
