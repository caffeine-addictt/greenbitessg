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
import { eventRequestObject } from '../lib/api-types/schemas/event';
import { IAuthedRouteHandler } from '../route-map';

// Handle /v1/event GET
export const getEvent: IAuthedRouteHandler = async (_, res) => {
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

  // Send the response
  return res.status(200).json({
    status: 200,
    data: formattedEvents,
  } satisfies GetEventSuccAPI);
};

// Handle /v1/event POST
export const createEvent: IAuthedRouteHandler = async (req, res) => {
  const validated = eventRequestObject.safeParse(req.body);
  if (!validated.success) {
    const errorStack = validated.error.errors.map((error) => ({
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

  // Insert to DB
  const [newEvent] = await db
    .insert(eventTable)
    .values({
      userId: req.user.id,
      title: validated.data.title,
      date: new Date(validated.data.date),
      time: validated.data.time,
      location: validated.data.location || '',
      description: validated.data.description || '',
    })
    .returning();

  return res.status(200).json({
    status: 200,
    data: {
      ...newEvent,
      title: newEvent.title ?? '',
      description: newEvent.description ?? '',
    },
  } satisfies CreateEventSuccAPI);
};

// Handle /v1/event/:id DELETE
export const deleteEvent: IAuthedRouteHandler = async (req, res) => {
  const eventId = parseInt(req.params.id, 10);

  if (isNaN(eventId) || eventId < 0) {
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
