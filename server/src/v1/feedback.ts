import { db } from '../db';
import { eq } from 'drizzle-orm';
import { feedbackTable } from '../db/schemas';
import { IAuthedRouteHandler } from '../route-map';
import {
  GetFeedbackSuccAPI,
  GetFeedbackFailAPI,
  CreateFeedbackFailAPI,
  CreateFeedbackSuccAPI,
  DeleteFeedbackSuccAPI,
  DeleteFeedbackFailAPI,
} from '@src/lib/api-types/feedback';
import { z } from 'zod';

// Define Zod schema for feedback request
const feedbackRequestObject = z.object({
  name: z.string().nonempty(),
  email: z.string().email(),
  suggestion: z.string().optional(),
  feedbackMessage: z.string().nonempty(),
});

// Define Zod schema for feedback response
const feedbackResponseObject = z.object({
  id: z.number(),
  name: z.string(),
  email: z.string(),
  suggestion: z.string().optional(),
  feedbackMessage: z.string(),
});

export const createFeedback: IAuthedRouteHandler = async (req, res) => {
  console.log('Fetching events for:', req.user.id); // Assuming `req.user` exists

  // Validate request body
  const validationResult = feedbackRequestObject.safeParse(req.body);

  if (!validationResult.success) {
    const errorStack = validationResult.error.errors.map((error) => ({
      message: error.message,
      context: {
        property: error.path.join('.'),
        code: error.code,
      },
    }));

    return res.status(400).json({
      status: 400,
      errors: errorStack,
    } satisfies CreateFeedbackFailAPI);
  }

  try {
    const { name, email, suggestion, feedbackMessage } = validationResult.data;

    // Create a new feedback entry
    const [newFeedback] = await db
      .insert(feedbackTable)
      .values({
        userId: req.user.id,
        name,
        email,
        suggestion: suggestion ?? '', // Default to empty string if undefined
        feedbackMessage,
      })
      .returning();

    // Format the response data using feedbackResponseObject
    const responseData = feedbackResponseObject.parse({
      id: newFeedback.id,
      name: newFeedback.name,
      email: newFeedback.email,
      suggestion: newFeedback.suggestion || '', // Default to empty string if undefined
      feedbackMessage: newFeedback.feedbackMessage,
    });

    return res.status(200).json({
      status: 200,
      data: responseData,
    } satisfies CreateFeedbackSuccAPI);
  } catch (error) {
    console.error('Server error:', error); // Log unexpected errors
    return res.status(500).json({
      status: 500,
      errors: [
        { message: 'An unexpected error occurred. Please try again later.' },
      ],
    });
  }
};

export const getFeedback: IAuthedRouteHandler = async (_, res) => {
  // Fetch all feedback
  const feedbacks = await db.select().from(feedbackTable);

  // Check if feedbacks were found
  if (feedbacks.length === 0) {
    return res.status(404).json({
      status: 404,
      errors: [{ message: 'No feedbacks found!' }],
    } satisfies GetFeedbackFailAPI);
  }

  const formattedFeedbacks = feedbacks.map((feedback) => ({
    id: feedback.id,
    name: feedback.name,
    email: feedback.email,
    suggestion: feedback.suggestion || undefined,
    feedbackMessage: feedback.feedbackMessage,
  }));

  // Send the response
  return res.status(200).json({
    status: 200,
    data: formattedFeedbacks,
  } satisfies GetFeedbackSuccAPI);
};

// Handle /v1/event/:id DELETE
export const deleteFeedback: IAuthedRouteHandler = async (req, res) => {
  const feedbackId = parseInt(req.params.id, 10);

  if (isNaN(feedbackId) || feedbackId < 0) {
    return res.status(400).json({
      status: 400,
      errors: [{ message: 'Invalid feedback ID' }],
    } satisfies DeleteFeedbackFailAPI);
  }

  await db.delete(feedbackTable).where(eq(feedbackTable.id, feedbackId));

  return res.status(200).json({
    status: 200,
    data: null,
  } satisfies DeleteFeedbackSuccAPI);
};