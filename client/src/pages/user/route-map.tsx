import type { RouteMap, PageComponent } from '@pages/route-map';

// Import pages
import AccountSettings from './accountsettings';
import Home from './homepage';
import InviteClient from './inviteclient';

const routeMap1: RouteMap = {
  '/settings': {
    title: 'Account Settings',
    description: 'Login to your account',
    component: AccountSettings,
    accessLevel: 'authenticated',
  },
  '/home': {
    title: 'Homepage',
    description: 'This is the homepage',
    component: Home,
  },
  '/inviteclient': {
    title: 'Invite Client',
    description: 'This is the Invite Client Page',
    component: InviteClient as PageComponent,
  },
} as const;
export default routeMap1;
