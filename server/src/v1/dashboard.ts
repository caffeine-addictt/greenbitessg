import { IAuthedRouteHandler } from '../route-map';
import {
  GetDashboardSuccAPI,
  GetDashboardFailAPI,
  UpdateDashboardSuccAPI,
  UpdateDashboardFailAPI,
} from '../lib/api-types/dashboard';
import { db } from '../db';
import { dashboardTable } from '../db/schemas';
import { eq } from 'drizzle-orm';
import { type errors, schemas } from '../lib/api-types';
import { Http4XX } from '../lib/api-types/http-codes';
import { ZodIssue } from 'zod';

export const getDashboard: IAuthedRouteHandler = async (req, res) => {
  let dashboard = await db
    .select()
    .from(dashboardTable)
    .where(eq(dashboardTable.userId, req.user.id));

  if (dashboard.length === 0) {
    const testData = {
      userId: req.user.id,
      title: 'Test Dashboard',
      description: 'This is a test description',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    dashboard = await db.insert(dashboardTable).values(testData).returning();
  }

  if (dashboard.length === 0) {
    return res.status(404).json({
      status: 404,
      errors: [{ message: 'No dashboard found for this user' }],
    } satisfies GetDashboardFailAPI);
  }

  const formattedDashboard = dashboard.map((dashboard) => ({
    id: dashboard.id,
    title: dashboard.title,
    description: dashboard.description || undefined,
    createdAt: dashboard.createdAt,
    updatedAt: dashboard.updatedAt,
  }));

  const salesData = [
    { date: '2023-01-01', amount: 100 },
    { date: '2023-02-01', amount: 200 },
    { date: '2023-03-01', amount: 150 },
    { date: '2023-04-01', amount: 350 },
    { date: '2023-05-01', amount: 250 },
    { date: '2023-06-01', amount: 400 },
  ];

  const sustainabilityData = [
    { label: 'Local Sourcing', value: 30 },
    { label: 'Organic Produce', value: 25 },
    { label: 'Waste Reduction', value: 20 },
    { label: 'Energy Efficiency', value: 15 },
    { label: 'Water Conservation', value: 10 },
  ];

  return res.status(200).json({
    status: 200,
    data: {
      dashboard: formattedDashboard,
      salesData: salesData,
      sustainabilityData: sustainabilityData,
    },
  } satisfies GetDashboardSuccAPI);
};

export const updateDashboard: IAuthedRouteHandler = async (req, res) => {
  const validated = schemas.dashboard.dashboardUpdateSchema.safeParse(req.body);
  if (!validated.success) {
    const errorStack: errors.CustomErrorContext[] = [];
    validated.error.errors.forEach((error: ZodIssue) => {
      errorStack.push({
        message: error.message,
        context: {
          property: error.path,
          code: error.code,
        },
      });
    });

    return res.status(Http4XX.BAD_REQUEST).json({
      status: Http4XX.BAD_REQUEST,
      errors: errorStack,
    } satisfies UpdateDashboardFailAPI);
  }

  if (!validated.data.title && !validated.data.description) {
    return res.status(Http4XX.BAD_REQUEST).json({
      status: Http4XX.BAD_REQUEST,
      errors: [{ message: 'Nothing to update!' }],
    } satisfies UpdateDashboardFailAPI);
  }

  await db
    .update(dashboardTable)
    .set(validated.data)
    .where(eq(dashboardTable.userId, req.user.id)); // Filter by the user's ID

  return res.status(200).json({
    status: 200,
    data: { updated: true },
  } satisfies UpdateDashboardSuccAPI);
};
