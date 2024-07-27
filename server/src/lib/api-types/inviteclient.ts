import * as z from 'zod';
import type { SuccessResponse } from './index';
import { inviteclient } from './schemas';

// Define the schema for form validation
export const inviteClientSchema = z.object({
  clientName: z.string().min(1, 'Client name is required'), // Client name should be a non-empty string
  email: z.string().email('Invalid email address'), // Email should be a valid email address
  inviteMessage: z.string().min(1, 'Invite message is required'), // Invite message should be a non-empty string
});

/**
 * Successful response for /v1/user endpoint
 */
export interface GetInviteClientSuccAPI
  extends SuccessResponse<z.infer<typeof inviteclient.inviteClientSchema>> {}
