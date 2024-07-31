import { db } from '../db';
import { eventTable } from '../db/schemas';
import { IAuthedRouteHandler } from '../route-map';
import {
  GetEventSuccAPI,
  GetEventFailAPI,
  CreateEventSuccAPI,
  CreateEventFailAPI,
} from '../lib/api-types/event';
import { eventSchema } from '../lib/api-types/schemas/event';

// API handler for fetching events
export const getEvent: IAuthedRouteHandler = async (req, res) => {
  // Example usage of req (e.g., logging user info or other data)
  console.log('Fetching events for:', req.user.id); // Assuming `req.user` exists

  // Fetch all events
  const events = await db.select().from(eventTable);

  // Check if events were found
  if (events.length === 0) {
    return res.status(404).json({
      status: 404,
      errors: [{ message: 'No events found!' }],
    } satisfies GetEventFailAPI);
  }

  // Ensure that the date is a Date object
  const formattedEvents = events.map((event) => ({
    id: event.id,
    title: event.title,
    date: new Date(event.date), // Ensure date is a Date object
    time: event.time,
    location: event.location,
    description: event.description || undefined, // Ensure description is optional
  }));

  // Construct the response object
  const response: GetEventSuccAPI = {
    status: 200,
    data: formattedEvents,
  };

  // Send the response
  return res.status(200).json(response);
};

// API handler for creating an event
export const createEvent: IAuthedRouteHandler = async (req, res) => {
  try {
    const userId = req.user.id;

    // Validate the request body against the event schema
    const result = eventSchema.safeParse(req.body);

    if (!result.success) {
      console.error('Validation failed:', result.error.format()); // Log validation errors
      return res.status(400).json({
        status: 400,
        errors: [
          {
            message: 'Invalid input data. Please check your form and try again',
          },
        ],
      } satisfies CreateEventFailAPI);
    }

    const { title, date, time, location, description } = result.data;

    // Convert date string to Date object
    const dateObject = new Date(date);

    // Create a new event and return the created event including its ID
    const [newEvent] = await db
      .insert(eventTable)
      .values({
        userId,
        title,
        date: dateObject, // Convert to Date object if necessary
        time,
        location,
        description: description || undefined,
      })
      .returning(); // Ensure this returns the newly created event

    // Construct the response object
    return res.status(200).json({
      status: 200,
      data: {
        id: newEvent.id,
        title: newEvent.title,
        date: newEvent.date, // Ensure date is in ISO format
        time: newEvent.time,
        location: newEvent.location,
        description: newEvent.description || undefined,
      },
    } satisfies CreateEventSuccAPI);
  } catch (error) {
    console.error('Server error:', error); // Log unexpected errors
    return res.status(500).json({
      status: 500,
      errors: [
        { message: 'An unexpected error occurred. Please try again later.' },
      ],
    });
  }
};
