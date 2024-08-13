/**
 * SPDX-FileCopyrightText: 2024 Ng Jun Xiang <contact@ngjx.org>
 *
 * SPDX-License-Identifier: GPL-3.0-only
 */

import { z } from 'zod';
import { useEffect, useState, useContext } from 'react';

import httpClient from '@utils/http';
import { PageComponent } from '@pages/route-map';
import { eventSchema } from '@lib/api-types/schemas/event';
import { AuthContext } from '@service/auth';

// Define the Event type using z.infer and eventSchema
type Event = z.infer<typeof eventSchema>;

const EventList: PageComponent = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [error, setError] = useState<string | null>(null);
  const { isAdmin } = useContext(AuthContext)!;

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

  const deleteEvent = async (id: number) => {
    try {
      await httpClient.delete<{ id: number }>({
        uri: `/event/${id}`,
        withCredentials: 'access',
      });

      // Remove the deleted event from the list
      setEvents(events.filter((event) => event.id !== id));
    } catch (err) {
      setError('Error deleting event! Please try again later.');
      console.error('Delete error:', err);
    }
  };

  return (
    <div className="container mx-auto mt-16">
      <h1 className="text-center text-2xl font-bold">Event List</h1>
      {error && <p className="text-red-500">{error}</p>}
      {events.length > 0 ? (
        <ul>
          {events.map((event) => (
            <li
              key={event.id}
              className="mb-4 rounded border border-gray-300 p-4"
            >
              <h2 className="text-xl font-semibold">{event.title}</h2>
              <p>{`${event.date} ${event.time}`}</p>
              <p>{event.location}</p>
              <p>{event.description}</p>
              {isAdmin && (
                <button
                  className="mt-2 rounded bg-red-500 px-4 py-2 text-white hover:bg-red-600"
                  onClick={() => deleteEvent(event.id)}
                >
                  Delete
                </button>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p>No events found.</p>
      )}
    </div>
  );
};

export default EventList;
