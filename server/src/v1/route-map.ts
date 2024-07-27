import type { RoutingMap } from '../route-map';

// Import endpoints
import authRoutes from './auth/route-map';
import { availability } from './availability';
import { getDashboard } from './dashboard';
import { getUser } from './user';

const routeMap: RoutingMap<`/v1/${string}`> = {
  ...authRoutes,
  '/v1/availability': {
    GET: { handler: availability },
  },
  '/v1/user': {
    GET: {
      handler: getUser,
      accessLevel: 'authenticated',
      authOptions: { allowNonActivated: true },
    },
  },
  '/v1/dashboard': {
    GET: {
      handler: getDashboard,
      accessLevel: 'authenticated',
    },
  },
} as const;

export default routeMap;
