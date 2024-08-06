import { z } from 'zod';

export const feedbackSchema = z.object({
  id: z
    .number({
      invalid_type_error: 'ID must be a positive integer',
      required_error: 'ID is required',
    })
    .int('ID must be an integer')
    .positive('ID must be a positive integer'),
  name: z
    .string({
      invalid_type_error: 'Name must be a string',
      required_error: 'Name is required',
    })
    .min(1, { message: 'Name is required' }),
  email: z
    .string({
      invalid_type_error: 'Email must be a string',
      required_error: 'Email is required',
    })
    .email('Invalid email address'),
  suggestion: z.string().min(1).optional(),
  feedbackMessage: z
    .string({
      invalid_type_error: 'Feedback message must be a string',
      required_error: 'Feedback message is required',
    })
    .min(1, { message: 'Feedback message is required' }),
});