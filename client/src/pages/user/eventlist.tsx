// src/pages/EventList.tsx

import React from 'react';
import { eventSchema } from '@lib/api-types/schemas/event';


// Mocked event data
const events = [
  {
    id: 1,
    title: 'Tech Conference',
    date: '2024-08-15T00:00:00Z',
    time: '09:00',
    location: 'Main Hall',
    description: 'A conference about the latest in technology.',
  },
  {
    id: 2,
    title: 'Team Building Workshop',
    date: '2024-08-20T00:00:00Z',
    time: '14:00',
    location: 'Conference Room B',
    description: 'A workshop focused on team building and collaboration.',
  },
  // More events as needed
];

// Validate the events array with the eventSchema
const validatedEvents = events.map(event => eventSchema.parse(event));

const EventList: React.FC = () => {
  return (
    <div className="max-w-2xl mx-auto p-4 bg-white shadow-md rounded">
      <h1 className="text-2xl font-bold mb-4">Event List</h1>
      <ul className="space-y-4">
        {validatedEvents.map((event) => (
          <li key={event.id} className="p-4 border border-gray-200 rounded-md shadow-sm">
            <h2 className="text-xl font-semibold">{event.title}</h2>
            <p className="text-gray-600">Date: {new Date(event.date).toLocaleDateString()}</p>
            <p className="text-gray-600">Time: {event.time}</p>
            <p className="text-gray-600">Location: {event.location}</p>
            {event.description && <p className="text-gray-700 mt-2">{event.description}</p>}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default EventList;
