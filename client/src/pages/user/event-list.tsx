import { useEffect, useState } from 'react';
import httpClient from '@utils/http';
import { z } from 'zod';
import { eventSchema } from '@lib/api-types/schemas/event'; // Adjust the import path as needed
import { PageComponent } from '@pages/route-map';

// Define the Event type using z.infer and eventSchema
type Event = z.infer<typeof eventSchema>;

const EventList: PageComponent = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      const response = await httpClient.get<{ data: Event[] }>({
        uri: `/event`,
        withCredentials: 'access', // Adjust if needed
      });

      // Ensure that response.data is an array of events
      setEvents(response.data);
    };

    fetchEvents().catch((err) => {
      setError('Error fetching events! Please try again later.');
      console.error('Fetch error:', err);
    });
  }, []);

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
              <p>{event.description || 'No description available'}</p>
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
