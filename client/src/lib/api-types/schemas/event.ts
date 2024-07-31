import * as z from 'zod';

export const eventSchema = z.object({
  id: z.number().int(),
  title: z.string().min(1),
  date: z.date(),
  time: z.string().min(1),
  location: z.string().min(1),
  description: z.string().optional(),
});
