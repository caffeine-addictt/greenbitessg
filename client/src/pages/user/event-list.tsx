import React, { useEffect, useState } from 'react';
import httpClient from '@utils/http';

interface Event {
  id: number;
  title: string;
  date: Date; // Ensure this matches the format returned by the API
  time: string;
  location: string;
  description?: string;
}

const EventList: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await httpClient.get<{ data: Event[] }>({
          uri: `/event`,
          withCredentials: 'access', // Adjust if needed
        });

        // Ensure that response.data.data is an array of events
        setEvents(response.data);
      } catch (err) {
        setError('Error fetching events! Please try again later.');
        console.error('Fetch error:', err);
      }
    };

    fetchEvents();
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
