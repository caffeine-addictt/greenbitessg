import { Request, Response } from 'express';
import { eventSchema } from '../lib/api-types/schemas/event';
import { IAuthedRouteHandler } from '../route-map';
import { GetEventSuccAPI } from '../lib/api-types/event';
import { z } from 'zod';

export const getEvent: IAuthedRouteHandler = async (req: Request, res: Response) => {
  try {
    // Assuming the event data is retrieved from some source, e.g., a database
    const eventData = {
      id: 1,
      title: 'Sample Event',
      date: '2024-08-01',
      time: '10:00 AM',
      location: 'Sample Location',
      description: 'This is a sample event description',
    };

    // Validate the event data using the schema
    const parsedEvent = eventSchema.parse(eventData);

    return res.status(200).json({
      status: 200,
      data: parsedEvent,
    } satisfies GetEventSuccAPI);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        status: 400,
        error: error.errors,
      });
    }

    return res.status(500).json({
      status: 500,
      error: 'Internal Server Error',
    });
  }
};
