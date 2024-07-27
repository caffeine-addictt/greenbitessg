import * as z from 'zod';

// Define the schema for the invite client form
export const inviteClientSchema = z.object({
  clientName: z.string().min(1, 'Client name is required'),
  email: z.string().email('Invalid email address'),
  inviteMessage: z.string().min(1, 'Invite message is required'),
});
