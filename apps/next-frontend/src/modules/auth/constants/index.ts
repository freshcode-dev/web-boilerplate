import { RootRoutes } from '@/constants';

export const SIGN_IN_CACHE_KEY = 'SIGN_IN_CACHE_KEY';
export const VERIFY_CACHE_KEY = 'VERIFY_CACHE_KEY';
export const REGISTER_CACHE_KEY = 'REGISTER_CACHE_KEY';

export const AuthRoutes = {
	Root: RootRoutes.Auth,
	LoginRoot: `${RootRoutes.Auth}/login`,
	LoginPhone: `${RootRoutes.Auth}/login/phone`,
	SignUp: `${RootRoutes.Auth}/sign-up`,
	ForgotPassword: `${RootRoutes.Auth}/forgot-password`,
	RestorePassword: `${RootRoutes.Auth}/restore-password`,
};
