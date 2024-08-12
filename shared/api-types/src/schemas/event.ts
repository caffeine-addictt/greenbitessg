import * as z from 'zod';

export const eventSchema = z.object({
  id: z.number().int(),
  title: z.string().min(1),
  date: z.date(),
  time: z.string().min(1),
  location: z.string().min(1),
  description: z.string().optional(),
});

// Define Zod schema for event request with custom error messages
export const eventRequestObject = z.object({
  title: z
    .string({
      required_error: 'Title is required',
    })
    .min(1, { message: 'Title is required' }),

  date: z
    .string({
      required_error: 'Date is required',
    })
    .min(1, { message: 'Date is required' }),

  time: z
    .string({
      required_error: 'Time is required',
    })
    .min(1, { message: 'Time is required' }),

  location: z
    .string({
      required_error: 'Location is required',
    })
    .min(1, { message: 'Location is required' }),

  description: z.string().optional(),
});

export const joinEvent = z.object({
  userId: z.number().int(),
  eventId: z.number().int(),
});
