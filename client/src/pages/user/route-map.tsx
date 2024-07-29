import type { RouteMap } from '@pages/route-map';

// Import pages
import AccountSettings from './accountsettings';
import Home from './homepage';

const userRouteMap: RouteMap = {
  '/settings': {
    title: 'Account Settings',
    description: 'Check your Account Settings',
    component: AccountSettings,
    accessLevel: 'authenticated',
  },
  '/home': {
    title: 'Homepage',
    description: 'This is the homepage',
    component: Home,
    accessLevel: 'authenticated',
  },
} as const;
export default userRouteMap;
