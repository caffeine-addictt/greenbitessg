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

const EventManage: PageComponent = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  // Fetch events from the server
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await httpClient.get<{ data: Event[] }>({
          uri: `/event`,
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
    navigate(`/events/${id}`);
  };

  return (
    <div className="container mx-auto mt-16">
      <h1 className="text-center text-2xl font-bold mb-4">Upcoming Events</h1>
      {error && <p className="text-red-500">{error}</p>}
      {events.length > 0 ? (
        <ul className='grid'>
          {events.map((event) => (
            <li
              key={event.id}
              className="grid grid-cols-1 md:grid-cols-2 bg-primary-dark mb-6 rounded-md border text-text-light border-gray-300"
            >
              <div className='p-10'>
                <h2 className="text-xl font-semibold">{event.title}</h2>
                <p>{`${event.id}`}</p>
                <p>Date: {`${event.date}`}</p>
                <p>Location: {event.location}</p>
              </div>
              <div className='relative mb-2 mr-2'>
                <Button className='p-4 !bg-primary-light !text-text-dark text-base font-semibold md:absolute md:bottom-0 md:right-0' onClick={() => redirectToEvent(event.id)}>
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

export default EventManage;
