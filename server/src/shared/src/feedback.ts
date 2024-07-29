import * as z from 'zod';

import { feedback } from './schemas';
import type { SuccessResponse } from './index';

/**
 * Successful response for /v1/user endpoint
 */
export interface GetFeedbackSuccAPI
  extends SuccessResponse<z.infer<typeof feedback.feedbackSchema>> {}
