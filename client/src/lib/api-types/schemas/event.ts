// src/types/Event.ts

import * as z from 'zod';

export const eventSchema = z.object({
  id: z.number().int(), // Event ID should be an integer
  title: z.string().min(1), // Event title should be a non-empty string
  date: z.string().refine(value => !isNaN(Date.parse(value)), {
    message: "Date must be a valid date string"
  }), // Date should be a valid date string
  time: z.string().min(1), // Event time should be a non-empty string
  location: z.string().min(1), // Location should be a non-empty string
  description: z.string().optional(), // Description is optional and can be a string
});
