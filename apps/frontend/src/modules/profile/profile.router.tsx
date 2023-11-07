import { RouteObject } from 'react-router-dom';
import { ProfilePage } from './pages/profile/profile.page';
import { ProfileSecurityPage } from './pages/security/security.page';
import { ProfileRoutes } from './constants';

export const ProfileModuleRouter: RouteObject[] = [
	{ path: ProfileRoutes.Root, element: <ProfilePage />, handle: { title: 'nav.profile' } },
	{ path: ProfileRoutes.SecuritySettings, element: <ProfileSecurityPage />, handle: { title: 'nav.security' } },
];
