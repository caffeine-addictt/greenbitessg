/**
 * SPDX-FileCopyrightText: 2024 Ng Jun Xiang <contact@ngjx.org>
 *
 * SPDX-License-Identifier: GPL-3.0-only
 */

import { z } from 'zod';
import * as React from 'react';
import { useEffect, useState } from 'react';

import { PageComponent } from '@pages/route-map';
import httpClient from '@utils/http';
import { eventSchema, joinEvent } from '@lib/api-types/schemas/event';
import { useParams } from 'react-router-dom';
import { Button } from '@components/ui/button';
import { AuthContext } from '@service/auth';
import { JoinEventSuccAPI } from '@lib/api-types/event';

// Define the Event type using z.infer and eventSchema
type Event = z.infer<typeof eventSchema>;

// Define the joinEvent type using z.infer
type JoinEventSchema = z.infer<typeof joinEvent>;

// finding the specific event based on id
const EventJoin: PageComponent = () => {
  const { id } = useParams();
  const [events, setEvents] = useState<Event[]>([]);
  const [error, setError] = useState<string | null>(null);
  const { user, isLoggedIn } = React.useContext(AuthContext)!;

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
  }, [id]);

  const joinEvent = async (eventId: number, userId: number) => {
    try {
      await httpClient.post<JoinEventSuccAPI, JoinEventSchema>({
        uri: `/event/${id}`,
        payload: { eventId, userId },
        withCredentials: 'access',
      });
    } catch (err) {
      setError('Error joining event! Please try again later.');
      console.error('Join error:', err);
    }
  };

  return (
    <div className="container mx-auto mt-16">
      <h1 className="text-center text-2xl font-bold">Event Details</h1>
      {error && <p className="text-red-500">{error}</p>}
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
                    {isLoggedIn && user ? (
                      <Button
                        variant="default"
                        className="mx-auto mt-5 !bg-primary-light px-6 py-5 text-base font-semibold !text-text-dark"
                        onClick={() => joinEvent(event.id, user.id)}
                      >
                        Join
                      </Button>
                    ) : (
                      <Button
                        variant="default"
                        className="mx-auto mt-5 !bg-primary-light px-6 py-5 text-base font-semibold !text-text-dark"
                      >
                        Join
                      </Button>
                    )}
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
