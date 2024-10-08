/**
 * SPDX-FileCopyrightText: 2024 Ng Jun Xiang <contact@ngjx.org>
 *
 * SPDX-License-Identifier: GPL-3.0-only
 */

import * as z from 'zod';
import type { SuccessResponse, ErrorResponse } from './index';
import { dashboardUpdateSchema } from './schemas/dashboard';

/**
 * Successful response for /v1/user endpoint
 */
// Define types for sales data and sustainability data
interface SalesData {
  date: string;
  amount: number;
}

interface SustainabilityData {
  label: string; // Ensure the 'label' property is included
  value: number;
}

// Define the Dashboard type using z.infer and dashboardUpdateSchema
export type Dashboard = z.infer<typeof dashboardUpdateSchema>;

export interface DashboardResponse {
  data: DashboardResponse | PromiseLike<DashboardResponse>;
  dashboard: Dashboard[];
  salesData: SalesData[];
  sustainabilityData: SustainabilityData[];
}

// Successful response for /v1/dashboard endpoint
export interface GetDashboardSuccAPI
  extends SuccessResponse<{
    dashboard: Dashboard[];
    salesData: SalesData[];
    sustainabilityData: SustainabilityData[];
  }> {}

/**
 * Failure response for dashboard-related endpoints
 */
export type GetDashboardFailAPI = ErrorResponse<
  | 'An unexpected error occurred. Please try again later'
  | 'There was a problem accessing the database. Please try again later'
>;

/**
 * Successful response for /v1/user/update POST endpoint
 */
export interface UpdateDashboardSuccAPI
  extends SuccessResponse<{ updated: true }> {}
export type UpdateDashboardFailAPI = ErrorResponse<'Nothing to update!'>;
