import { z, ZodSchema } from 'zod';

export interface FeedbackFormValues {
  id: number;
  name: string;
  email: string;
  suggestion?: string;
  feedbackMessage: string;
}

export const feedbackSchema: ZodSchema<FeedbackFormValues> = z.object({
  id: z.number().int().positive('ID must be a positive integer'), // Add ID validation
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  suggestion: z.string().optional(),
  feedbackMessage: z.string().min(1, 'Feedback message is required'),
});
