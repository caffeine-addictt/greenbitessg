import { z } from 'zod';
import { IAuthedRouteHandler } from '../route-map';
import { GetDashboardSuccAPI } from '../lib/api-types/dashboard';

// Define the schema for the dashboard
export const dashboardSchema = z.object({
  id: z.number().int().positive().optional(), // Optional because it might be auto-generated
  title: z.string().min(1, 'Title is required'), // Ensure the title is a non-empty string
  description: z.string().optional(), // Optional field for description
  isActive: z.boolean().default(true), // Default value is true if not provided
  createdAt: z.date().default(() => new Date()), // Default to current date
  updatedAt: z.date().default(() => new Date()), // Default to current date
});

// Handler for getting dashboard data
export const getDashboard: IAuthedRouteHandler = async (_req, res) => {
  // Example dashboard data; replace with actual data fetching logic
  const dashboardData = {
    id: 1, // Example value
    title: 'Dashboard Title',
    description: 'Sample description', // Example value
    isActive: true, // Example value
    createdAt: new Date(), // Example value
    updatedAt: new Date(), // Example value
  };

  // Validate the data with the schema
  const validationResult = dashboardSchema.safeParse(dashboardData);

  if (!validationResult.success) {
    return res.status(400).json({
      status: 400,
      error: 'Invalid data format',
      issues: validationResult.error.errors,
    });
  }

  return res.status(200).json({
    status: 200,
    data: validationResult.data,
  } satisfies GetDashboardSuccAPI);
};
