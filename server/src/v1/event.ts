/**
 * SPDX-FileCopyrightText: 2024 Ng Jun Xiang <contact@ngjx.org>
 *
 * SPDX-License-Identifier: GPL-3.0-only
 */

import { db } from '../db';
import { and, eq, inArray } from 'drizzle-orm';
import { eventTable, usersToEvent } from '../db/schemas';

import {
  GetEventSuccAPI,
  GetEventFailAPI,
  CreateEventSuccAPI,
  CreateEventFailAPI,
  DeleteEventSuccAPI,
  DeleteEventFailAPI,
  JoinEventSuccAPI,
  JoinEventFailAPI,
  LeaveEventSuccAPI,
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

export const getAnEvent: IAuthedRouteHandler = async (req, res) => {
  // get ID from query parameter
  const id = parseInt(req.params.id, 10);

  // Fetch a specific event by ID
  const events = await db.select().from(eventTable).where(eq(eventTable.id, id));

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

// Handle /v1/event/:id POST
export const joinEvent: IAuthedRouteHandler = async (req, res) => {
  // get event ID from query parameter
  const eventId = parseInt(req.params.id, 10);
  // get user ID
  const userId = req.user.id

  // Fetch a specific event by ID
  const event = await db.select().from(eventTable).where(eq(eventTable.id, eventId));

  // Check if events were found
  if (event.length === 0) {
    return res.status(404).json({
      status: 404,
      errors: [{ message: 'No events found!' }],
    } satisfies JoinEventFailAPI);
  }

  // Check if the user is already joined to the event
  const existingJoin = await db.select().from(usersToEvent)
      .where(and(eq(usersToEvent.eventId, eventId), eq(usersToEvent.userId, userId)))

  if (existingJoin.length > 0) {
    return res.status(400).json({
      status: 400,
      errors: [{ message: 'User is already joined to this event.' }],
    } satisfies JoinEventFailAPI);
  }

  // Insert the user-event association into the userEventTable
  await db.insert(usersToEvent).values({
    userId,
    eventId,
  });

  // Send the success response
  return res.status(200).json({
    status: 200,
    data: {
      userId,
      eventId,
    },
  } satisfies JoinEventSuccAPI);
};

// Handle /v1/user/event GET
export const getUserJoinedEvent: IAuthedRouteHandler = async (req, res) => {
  const userId = req.user.id
  // Fetch event ID that match with current user ID
  const eventID = await db
  .select({ eventId: usersToEvent.eventId })
  .from(usersToEvent)
  .where(eq(usersToEvent.userId, userId));

  // check if ID is empty
  if (eventID.length === 0) {
    return res.status(404).json({
      status: 404,
      errors: [{ message: 'You did not signed up for any events yet!' }],
    } satisfies GetEventFailAPI);
  }

  const eventIDArray: number[] = eventID.map(result => result.eventId).filter((id): id is number => id !== null);

  // Fetch all events where it matches eventID
  const events = await db
  .select()
  .from(eventTable)
  .where(inArray(eventTable.id, eventIDArray));

  // Check if events were found
  if (events.length === 0) {
    return res.status(404).json({
      status: 404,
      errors: [{ message: 'Events do not exist' }],
    } satisfies GetEventFailAPI);
  }

  // Format events
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

// Handle /v1/user/event/:id DELETE
export const leaveEvent: IAuthedRouteHandler = async (req, res) => {
  const eventId = parseInt(req.params.id, 10);
  const userId = req.user.id

  if (isNaN(eventId) || eventId < 0) {
    return res.status(400).json({
      status: 400,
      errors: [{ message: 'Invalid event ID' }],
    } satisfies DeleteEventFailAPI);
  }

  await db.delete(usersToEvent).where(and(eq(usersToEvent.eventId, eventId), eq(usersToEvent.userId, userId)));

  return res.status(200).json({
    status: 200,
    data: {
      userId,
      eventId,
    },
  } satisfies LeaveEventSuccAPI);
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
