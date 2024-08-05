import { z } from 'zod';

// Define the schema for the dashboard
export const dashboardSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});
