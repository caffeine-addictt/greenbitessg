import { useEffect, useState } from 'react';
import { z } from 'zod';

import httpClient from '@utils/http';
import { PageComponent } from '@pages/route-map';
import { feedbackSchema } from '@lib/api-types/schemas/feedback';

// Define the Feedback type using z.infer and feedbackSchema
type Feedback = z.infer<typeof feedbackSchema>;

const FeedbackList: PageComponent = () => {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Fetch feedback from the server
  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        const response = await httpClient.get<{ data: Feedback[] }>({
          uri: `/feedback`,
          withCredentials: 'access',
        });
        setFeedbacks(response.data);
      } catch (err) {
        setError('Error fetching feedback! Please try again later.');
        console.error('Fetch error:', err);
      }
    };

    fetchFeedbacks();
  }, []);

  return (
    <div className="container mx-auto mt-16">
      <h1 className="text-center text-2xl font-bold">Feedback List</h1>
      {error && <p className="text-red-500">{error}</p>}
      {feedbacks.length > 0 ? (
        <ul>
          {feedbacks.map((feedback) => (
            <li
              key={feedback.id}
              className="mb-4 rounded border border-gray-300 p-4"
            >
              <h2 className="text-xl font-semibold">{feedback.name}</h2>
              <p>Email: {feedback.email}</p>
              <p>Suggestion: {feedback.suggestion || 'N/A'}</p>
              <p>Message: {feedback.feedbackMessage}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p>No feedback available.</p>
      )}
    </div>
  );
};

export default FeedbackList;
