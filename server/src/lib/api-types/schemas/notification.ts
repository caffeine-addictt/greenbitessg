import { z } from 'zod';

export const notificationSchema = z.object({
  id: z
    .number({
      invalid_type_error: 'ID must be a positive integer',
      required_error: 'ID is required',
    })
    .int('ID must be an integer')
    .positive('ID must be a positive integer'),
  notificationMessage: z
    .string({
      invalid_type_error: 'Feedback message must be a string',
      required_error: 'Feedback message is required',
    })
    .min(1, { message: 'Feedback message is required' }),
  notificationType: z
    .string({
      invalid_type_error: 'Notification type must be a string',
      required_error: 'Notification type is required',
    })
    .default('info'),
  expiresAt: z
    .string({
      invalid_type_error: 'Expiration date must be a string',
    })
    .datetime({ message: 'Expiration date must be a valid datetime' })
    .optional(),
});
