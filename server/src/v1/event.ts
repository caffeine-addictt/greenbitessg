/**
 * SPDX-FileCopyrightText: 2024 Ng Jun Xiang <contact@ngjx.org>
 *
 * SPDX-License-Identifier: GPL-3.0-only
 */

import { db } from '../db';
import { eq } from 'drizzle-orm';
import { eventTable } from '../db/schemas';

import {
  GetEventSuccAPI,
  GetEventFailAPI,
  CreateEventSuccAPI,
  CreateEventFailAPI,
  DeleteEventSuccAPI,
  DeleteEventFailAPI,
} from '../lib/api-types/event';
// API handler for fetching events
export const getEvent: IAuthedRouteHandler = async (req, res) => {
  // Example usage of req (e.g., logging user info or other data)
  console.log('Fetching events for:', req.user.id); // Assuming `req.user` exists
import { eventRequestObject } from '../lib/api-types/schemas/event';

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
    date: new Date(event.date),
    time: event.time,
    location: event.location,
    description: event.description || undefined,
  }));

  // Construct the response object
  const response: GetEventSuccAPI = {
    status: 200,
    data: formattedEvents,
  };

  // Send the response
  return res.status(200).json(response);
};

export const createEvent: IAuthedRouteHandler = async (req, res) => {
  // Validate request body
  const validationResult = eventRequestObject.safeParse(req.body);

  if (!validationResult.success) {
    const errorStack = validationResult.error.errors.map((error) => ({
      message: error.message,
      context: {
        property: error.path.join('.'),
        code: error.code,
      },
    }));

    return res.status(400).json({
      status: 400,
      errors: errorStack,
    } satisfies CreateEventFailAPI);
  }

  try {
    const { title, date, time, location, description } = validationResult.data;

    // Convert date string to Date object
    const dateObject = new Date(date);

    // Create a new event and return the created event including its ID
    const [newEvent] = await db
      .insert(eventTable)
      .values({
        userId: req.user.id, // Make sure `req.user.id` is defined
        title,
        date: dateObject, // Ensure date is a Date object
        time,
        location: location || '', // Default to empty string if undefined
        description: description || '', // Default to empty string if undefined
      })
      .returning();

    // Format the response data using eventResponseObject
    const responseData = eventResponseObject.parse({
      id: newEvent.id,
      title: newEvent.title,
      date: newEvent.date, // Convert Date object to ISO string
      time: newEvent.time,
      location: newEvent.location || '', // Default to empty string if undefined
      description: newEvent.description || '', // Default to empty string if undefined
    });

    return res.status(200).json({
      status: 200,
      data: responseData,
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
export const deleteEvent: IAuthedRouteHandler = async (req, res) => {
  const eventId = parseInt(req.params.id, 10);

  if (isNaN(eventId)) {
    return res.status(400).json({
      status: 400,
      errors: [{ message: 'Invalid event ID' }],
    } satisfies DeleteEventFailAPI);
  }

  await db.delete(eventTable).where(eq(eventTable.id, eventId));

  return res.status(200).json({
    status: 200,
    data: null,
  } satisfies DeleteEventSuccAPI);
};
