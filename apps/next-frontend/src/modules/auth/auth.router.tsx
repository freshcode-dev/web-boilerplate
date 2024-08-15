import { AuthRoutes } from './constants';
import { RouteDefinition } from '@/modules/_core/types';

export const AuthModuleRouter: RouteDefinition[] = [
	{
		path: AuthRoutes.Root,
		handle: { title: 'nav.sign-in' },
	},
	{
		path: AuthRoutes.LoginRoot,
		handle: { title: 'nav.sign-in' },
	},
	{
		path: AuthRoutes.LoginPhone,
		handle: { title: 'nav.account-sign-in' },
	},
	{
		path: AuthRoutes.SignUp,
		handle: { title: 'nav.sign-up' },
	},
];
