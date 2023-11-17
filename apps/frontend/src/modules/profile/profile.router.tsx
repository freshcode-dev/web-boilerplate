import { RouteObject } from 'react-router-dom';
import { ProfilePage } from './pages/profile/profile.page';
import { ProfileSecurityPage } from './pages/security/security.page';
import { DemoPage } from './pages/demo/demo.page';
import { ProfileRoutes } from './constants';

export const ProfileModuleRouter: RouteObject[] = [
	{ path: ProfileRoutes.Root, element: <DemoPage />, handle: { title: 'nav.demo' } },
	{ path: ProfileRoutes.Profile, element: <ProfilePage />, handle: { title: 'nav.profile', to: ProfileRoutes.Root } },
	{ path: ProfileRoutes.SecuritySettings, element: <ProfileSecurityPage />, handle: { title: 'nav.profile', to: ProfileRoutes.Root } },
];
