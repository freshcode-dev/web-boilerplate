import { ProfileRoutes } from './constants';
import { RouteDefinition } from '@/modules/_core/types';

export const ProfileModuleRouter: RouteDefinition[] = [
	{
		path: ProfileRoutes.Root,
		handle: { title: 'nav.profile' },
	},
	{
		path: ProfileRoutes.SecuritySettings,
		handle: { title: 'nav.security' },
	}
];
