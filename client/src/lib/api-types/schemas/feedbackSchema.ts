import { z, ZodSchema } from 'zod';

export interface FeedbackFormValues {
  name: string;
  email: string;
  suggestion?: string;
  feedbackMessage: string;
}

export const feedbackSchema: ZodSchema<FeedbackFormValues> = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  suggestion: z.string().optional(),
  feedbackMessage: z.string().min(1, 'Feedback message is required'),
});
