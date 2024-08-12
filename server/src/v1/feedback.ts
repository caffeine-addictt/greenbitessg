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
} from '../lib/api-types/feedback';
import {
  feedbackRequestObject,
  feedbackResponseObject,
} from '../lib/api-types/schemas/feedback';

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
  const feedbacks = await db
    .select({
      id: feedbackTable.id,
      name: feedbackTable.name,
      email: feedbackTable.email,
      suggestion: feedbackTable.suggestion, // Use `null` directly as some SQL clients expect it
      feedbackMessage: feedbackTable.feedbackMessage,
    })
    .from(feedbackTable);

  // Convert `null` to `undefined` in the application logic
  const formattedFeedbacks = feedbacks.map((feedback) => ({
    ...feedback,
    suggestion: feedback.suggestion ?? undefined, // Convert `null` to `undefined`
  }));
  // Check if feedbacks were found
  if (feedbacks.length === 0) {
    return res.status(404).json({
      status: 404,
      errors: [{ message: 'No feedbacks found!' }],
    } satisfies GetFeedbackFailAPI);
  }

  // Send the response
  return res.status(200).json({
    status: 200,
    data: formattedFeedbacks,
  } satisfies GetFeedbackSuccAPI);
};

// Handle /v1/event/:id DELETE
export const deleteFeedback: IAuthedRouteHandler = async (req, res) => {
  const feedbackId = parseInt(req.params.id);

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
