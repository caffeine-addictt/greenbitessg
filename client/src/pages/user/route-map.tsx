import type { RouteMap } from '@pages/route-map';

// Import pages

import AccountSettings from './accountsettings'; // Adjust the path if necessary

const routeMap: RouteMap = {
  '/accountsettings': {
    title: 'Account Settings',
    description: 'Manage your account settings',
    component: AccountSettings,
  },
} as const;

export default routeMap;
