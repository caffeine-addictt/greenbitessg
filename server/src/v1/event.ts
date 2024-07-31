import { db } from '../db';
import { eventTable } from '../db/schemas';
import { IAuthedRouteHandler } from '../route-map';
import {
  GetEventSuccAPI,
  GetEventFailAPI,
  CreateEventSuccAPI,
  CreateEventFailAPI,
} from '../lib/api-types/event';
import { eq } from 'drizzle-orm';
import { eventSchema } from '../lib/api-types/schemas/event';

// API handler for fetching events
export const getEvent: IAuthedRouteHandler = async (req, res) => {
  // Validate user ID
  if (!req.user || !req.user.id) {
    return res.status(401).json({
      status: 401,
      errors: [{ message: 'Unauthorized: User ID missing!' }],
    } satisfies GetEventFailAPI);
  }

  const userId = req.user.id;

  // Fetch events for the authenticated user
  const events = await db
    .select()
    .from(eventTable)
    .where(eq(eventTable.userId, userId));

  // Check if events were found
  if (events.length === 0) {
    return res.status(404).json({
      status: 404,
      errors: [{ message: 'No events found for this user!' }],
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
  // Validate user ID
  if (!req.user || !req.user.id) {
    return res.status(401).json({
      status: 401,
      errors: [{ message: 'Unauthorized: User ID missing!' }],
    } satisfies CreateEventFailAPI);
  }

  const userId = req.user.id;

  // Validate the request body against the event schema
  const result = eventSchema.safeParse(req.body);

  if (!result.success) {
    return res.status(400).json({
      status: 400,
      errors: [
        { message: 'Invalid input data. Please check your form and try again' },
      ],
    } satisfies CreateEventFailAPI);
  }

  const { title, date, time, location, description } = result.data;

  // Create a new event and return the created event including its ID
  const [newEvent] = await db
    .insert(eventTable)
    .values({
      userId,
      title,
      date: new Date(date), // Ensure date is a Date object
      time,
      location,
      description: description ?? null, // Use null if description is optional
    })
    .returning(); // Ensure this returns the newly created event

  // Construct the response object
  const response: CreateEventSuccAPI = {
    status: 200,
    data: {
      id: newEvent.id, // Ensure the ID is included in the response
      title: newEvent.title,
      date: new Date(newEvent.date), // Convert Date to ISO string
      time: newEvent.time,
      location: newEvent.location,
      description: newEvent.description || undefined, // Ensure description is optional
    },
  };

  // Send the response
  return res.status(201).json(response);
};
