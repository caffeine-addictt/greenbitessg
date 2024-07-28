import { db } from '../db';
import { feedbackTable } from '../db/schemas';
import {
  feedbackSchema,
  FeedbackFormValues,
} from '../lib/api-types/schemas/feedback';
import type { IBareRouteHandler } from '@src/route-map';
import type {
  GetFeedbackSuccAPI,
  GetFeedbackFailAPI,
} from '../lib/api-types/feedback';
import { eq } from 'drizzle-orm';

async function fetchFeedbackById(
  id: number,
): Promise<FeedbackFormValues | null> {
  try {
    const feedbackData = await db
      .select()
      .from(feedbackTable)
      .where(eq(feedbackTable.id, id))
      .limit(1);

    if (feedbackData.length === 0) {
      return null;
    }

    const feedbackEntry = feedbackData[0];

    const feedbackFormValues: FeedbackFormValues = {
      id: feedbackEntry.id,
      name: feedbackEntry.name,
      email: feedbackEntry.email,
      suggestion: feedbackEntry.suggestion ?? undefined,
      feedbackMessage: feedbackEntry.feedbackMessage,
    };

    return feedbackFormValues;
  } catch (error) {
    console.error('Error fetching feedback:', error);
    return null;
  }
}

export const getFeedback: IBareRouteHandler = async (req, res) => {
  const feedbackId = parseInt(req.params.id, 10);

  if (isNaN(feedbackId)) {
    return res.status(400).json({
      status: 400,
      message: 'Invalid feedback ID',
    });
  }

  const feedbackData = await fetchFeedbackById(feedbackId);

  if (!feedbackData) {
    return res.status(404).json({
      error: 'Feedback not found',
      code: 404,
      details: 'No feedback found with the provided ID',
    } satisfies GetFeedbackFailAPI);
  }

  // Validate the fetched data with the schema
  const validationResult = feedbackSchema.safeParse(feedbackData);

  if (!validationResult.success) {
    // Summarize the errors into a single string
    const errorMessages = validationResult.error.errors
      .map((err) => err.message)
      .join(', ');

    return res.status(400).json({
      error: 'Invalid feedback data',
      code: 400,
      details: errorMessages,
    } satisfies GetFeedbackFailAPI);
  }

  return res.status(200).json({
    status: 200,
    data: validationResult.data,
  } satisfies GetFeedbackSuccAPI);
};
