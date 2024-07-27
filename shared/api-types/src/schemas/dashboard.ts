import { z } from 'zod';

// Define the schema for the dashboard
export const dashboardSchema = z.object({
  id: z.number().int().positive().optional(), // Optional because it might be auto-generated
  title: z.string().min(1, 'Title is required'), // Ensure the title is a non-empty string
  description: z.string().optional(), // Optional field for description
  isActive: z.boolean().default(true), // Optional field with a default value
  createdAt: z.date().default(() => new Date()), // Default to current date
  updatedAt: z.date().default(() => new Date()), // Default to current date
});
