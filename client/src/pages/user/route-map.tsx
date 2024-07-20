import type { RouteMap } from '@pages/route-map';
import AccountSettings from './accountsettings'; // Ensure this path is correct

const routeMap1: RouteMap = {
  '/accountsettings': {
    title: 'Account Settings',
    description: 'Manage your account settings',
    component: AccountSettings,
  },
} as const;

export default routeMap1;
