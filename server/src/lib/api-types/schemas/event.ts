import * as z from 'zod';

export const eventSchema = z.object({
  id: z.number().int(), // Event ID should be an integer
  title: z.string().min(1), // Event title should be a non-empty string
  date: z.date(), // Date should be a valid Date object
  time: z.string().min(1), // Event time should be a non-empty string
  location: z.string().min(1), // Location should be a non-empty string
  description: z.string().optional(), // Description is optional and can be a string
});
