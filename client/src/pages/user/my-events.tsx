/**
 * SPDX-FileCopyrightText: 2024 Ng Jun Xiang <contact@ngjx.org>
 *
 * SPDX-License-Identifier: GPL-3.0-only
 */

import { z } from 'zod';
import * as React from 'react';
import { useEffect, useState } from 'react';
import { cn } from '@utils/tailwind';
import { X } from 'lucide-react';

import { PageComponent } from '@pages/route-map';
import httpClient from '@utils/http';
import { eventSchema, joinEvent } from '@lib/api-types/schemas/event';
import { LeaveEventSuccAPI } from '@lib/api-types/event';
import { useParams } from 'react-router-dom';
import { Button } from '@components/ui/button';
import { AuthContext } from '@service/auth';

// Define the Event type using z.infer and eventSchema
type Event = z.infer<typeof eventSchema>;

// Define the joinEvent type using z.infer
type JoinEventSchema = z.infer<typeof joinEvent>;

// finding the specific event based on id
const EventView: PageComponent = () => {
  const { id } = useParams();
  const [events, setEvents] = useState<Event[]>([]);
  const [error, setError] = useState<string | null>(null);
  const { user } = React.useContext(AuthContext)!;
  const [showModal, setShowModal] = useState<boolean>(false);

  useEffect(() => {
    const getUsersEvent = async (id: number) => {
      try {
        const response = await httpClient.get<{ data: Event[] }>({
          uri: `/event/${id}`,
          withCredentials: 'access',
        });

        // retrieve events
        setEvents(response.data);
      } catch (err) {
        setError('Error retrieveing event! Please try again later.');
        console.log(err);
      }
    };

    getUsersEvent(parseInt(id!));
  }, [id]);

  const leaveEvent = async (eventId: number, userId: number) => {
    try {
      await httpClient.post<LeaveEventSuccAPI, JoinEventSchema>({
        uri: `/user/event/${id}`,
        payload: { eventId, userId },
        withCredentials: 'access',
      });

      setShowModal(false);
      window.location.href = '/my-events';
    } catch (err) {
      setError('Error leaving event! Please try again later.');
      console.log(error);
    }
  };

  return (
    <div className="container mx-auto mt-16">
      <h1 className="text-center text-2xl font-bold">Event Details</h1>
      {events.length > 0 ? (
        <div className="mb-5 flex flex-col items-center">
          {events.map((event) => (
            <>
              <div key={event.id} className="relative mx-auto mt-10 flex">
                <div
                  key={event.id}
                  className="mb-6 w-full max-w-4xl rounded-lg bg-surface-light/5 p-6"
                >
                  <div className="px-10 py-5 text-left">
                    <h2 className="mb-4 text-center text-2xl font-semibold">
                      Event Name: {event.title}
                    </h2>
                    <p className="mb-4">Description: {event.description}</p>
                    <p className="mb-4">Date: {`${event.date}`}</p>
                    <p className="mb-4">Time: {`${event.time}`}</p>
                    <p className="mb-4">Location: {event.location}</p>
                    {user ? (
                      <>
                        <Button
                          variant="destructive"
                          className="mx-auto mt-5 px-6 py-5 text-base font-semibold !text-text-dark"
                          onClick={() => setShowModal(true)}
                        >
                          Leave
                        </Button>
                        <div
                          className={cn(
                            'left-1/2 -translate-x-1/2 top-1/2 transition-all flex -translate-y-1/2 flex-col items-center justify-center rounded-md bg-accent-dark drop-shadow w-4/5',
                            {
                              absolute: showModal,
                              hidden: !showModal,
                              'opatity-0': !showModal,
                              'opacity-100': showModal,
                            },
                          )}
                        >
                          <div className="relative flex size-fit flex-col items-center justify-center rounded-lg p-10">
                            <h2 className="mb-4 text-lg font-semibold underline">
                              Leaving Event
                            </h2>
                            <p className="mb-6 text-center">
                              Are you sure you want to leave the event:{' '}
                              {event.title}?
                            </p>
                            <Button
                              variant="destructive"
                              className="font-semibold"
                              onClick={() => leaveEvent(event.id, user.id)}
                            >
                              Confirm
                            </Button>
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
                      </>
                    ) : (
                      <p>Cannot leave when u are not logged in</p>
                    )}
                  </div>
                </div>
              </div>
            </>
          ))}
        </div>
      ) : (
        <p className="mx-auto">You have not joined any events yet!</p>
      )}
    </div>
  );
};
export default EventView;
