import { RootRoutes } from "../../../constants";

export const AuthRoutes = {
	Root: RootRoutes.Auth,
	LoginPhone: `${RootRoutes.Auth}/login/phone`,
	LoginEmail: `${RootRoutes.Auth}/login/email`,
	SignUp: `${RootRoutes.Auth}/sign-up`,
	ForgotPassword: `${RootRoutes.Auth}/forgot-password`,
	RestorePassword: `${RootRoutes.Auth}/restore-password`,
};
