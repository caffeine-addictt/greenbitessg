/**
 * SPDX-FileCopyrightText: 2024 Ng Jun Xiang <contact@ngjx.org>
 *
 * SPDX-License-Identifier: GPL-3.0-only
 */

import { z } from 'zod';
import { useEffect, useState } from 'react';

import httpClient from '@utils/http';
import { PageComponent } from '@pages/route-map';
import { eventSchema } from '@lib/api-types/schemas/event';
import { Button } from '@components/ui/button';
import { useNavigate } from 'react-router-dom';

// Define the Event type using z.infer and eventSchema
type Event = z.infer<typeof eventSchema>;

const MyEvents: PageComponent = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  // Fetch events from the server
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await httpClient.get<{ data: Event[] }>({
          uri: `/user/event`,
          withCredentials: 'access',
        });
        setEvents(response.data);
      } catch (err) {
        setError('Error fetching events! Please try again later.');
        console.error('Fetch error:', err);
      }
    };

    fetchEvents();
  }, []);

  const redirectToEvent = (id: number) => {
    navigate(`/my-events/${id}`);
  };

  return (
    <div className="container mx-auto mt-16">
      <h1 className="mb-4 text-center text-2xl font-bold">My Events</h1>
      {error && <p className="text-red-500">{error}</p>}
      {events.length > 0 ? (
        <ul className="grid">
          {events.map((event) => (
            <li
              key={event.id}
              className="mb-6 grid grid-cols-1 rounded-md border border-gray-300 bg-primary-dark text-text-light md:grid-cols-2"
            >
              <div className="p-10">
                <h2 className="text-xl font-semibold">{event.title}</h2>
                <p>{`${event.id}`}</p>
                <p>Date: {`${event.date}`}</p>
                <p>Location: {event.location}</p>
              </div>
              <div className="relative mb-2 mr-2">
                <Button
                  className="!bg-primary-light p-4 text-base font-semibold !text-text-dark md:absolute md:bottom-0 md:right-0"
                  onClick={() => redirectToEvent(event.id)}
                >
                  Learn More
                </Button>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p>No upcoming events at the moment.</p>
      )}
    </div>
  );
};

export default MyEvents;
