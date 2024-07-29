import { z } from 'zod';

// Define the schema for the dashboard
export const dashboardSchema = z.object({
  id: z.number().int().positive().optional(),
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  isActive: z.boolean().default(true),
  createdAt: z.date().default(() => new Date()),
  updatedAt: z.date().default(() => new Date()),
});
