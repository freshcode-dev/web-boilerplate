import { RootRoutes } from "../../../constants";

export const AuthRoutes = {
	Root: RootRoutes.Auth,
	LoginPhone: `${RootRoutes.Auth}/login/phone`,
	LoginEmail: `${RootRoutes.Auth}/login/email`,
	SignUp: `${RootRoutes.Auth}/sign-up`,

	// TODO: implement these routes
	ResetPassword: `${RootRoutes.Auth}/reset-password`,
	ResetPasswordConfirm: `${RootRoutes.Auth}/reset-password-confirm`,
	VerifyEmail: `${RootRoutes.Auth}/verify-email`,
};
