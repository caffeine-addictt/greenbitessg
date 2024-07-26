import { IAuthedRouteHandler } from '../route-map';
import { feedbackSchema } from '@src/lib/api-types/schemas/feedback'; // Adjust the path as needed
import { FeedbackFormValues } from '@src/lib/api-types/schemas/feedback';
import type { GetFeedbackSuccAPI } from '../lib/api-types/feedback'; // Adjust the path as needed

// Example function to fetch feedback data by ID (replace with actual implementation)
async function fetchFeedbackById(
  id: number,
): Promise<FeedbackFormValues | null> {
  // Replace with your actual implementation to fetch feedback data
  // Simulate fetching data based on the provided id
  if (id === 1) {
    return {
      id: 1,
      name: 'Jane Doe',
      email: 'jane.doe@example.com',
      suggestion: 'Add more features',
      feedbackMessage: 'Great product, but needs improvements in usability.',
    };
  }

  // Return null if no data is found for the given id
  return null;
}

export const getFeedback: IAuthedRouteHandler = async (req, res) => {
  // Extract feedback ID from the request params or query
  const feedbackId = parseInt(req.params.id, 10); // Ensure feedbackId is a number

  if (isNaN(feedbackId)) {
    return res.status(400).json({
      status: 400,
      message: 'Invalid feedback ID',
    });
  }

  // Fetch feedback data from a database or another source using feedbackId
  const feedbackData = await fetchFeedbackById(feedbackId);

  if (!feedbackData) {
    return res.status(404).json({
      status: 404,
      message: 'Feedback not found',
    });
  }

  // Validate the fetched feedback data
  const validationResult = feedbackSchema.safeParse(feedbackData);

  if (!validationResult.success) {
    return res.status(500).json({
      status: 500,
      message: 'Feedback data is invalid',
      errors: validationResult.error.format(),
    });
  }

  // Return the valid feedback data in the correct format
  return res.status(200).json({
    status: 200,
    data: feedbackData,
  } satisfies GetFeedbackSuccAPI);
};
