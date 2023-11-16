import React from 'react';
import { Navigate, RouteObject } from 'react-router-dom';
import LoginWithPhonePage from './pages/login-with-phone/login-with-phone.page';
import LoginWithEmailPage from './pages/login-with-email/login-with-email.page';
import SignUpWithEmailPage from './pages/signup-with-email/signup-with-email.page';
import { AuthRoutes } from './constants';

export const AuthModuleRouter: RouteObject[] = [
	{
		path: AuthRoutes.Root,
		element: <Navigate to={AuthRoutes.LoginEmail} />,
		handle: { title: 'nav.sign-in' },
	},
	{ path: AuthRoutes.LoginEmail, element: <LoginWithEmailPage />, handle: { title: 'nav.sign-in-with-email' } },
	{ path: AuthRoutes.LoginPhone, element: <LoginWithPhonePage />, handle: { title: 'nav.sign-in-with-phone' } },
	{ path: AuthRoutes.SignUp, element: <SignUpWithEmailPage />, handle: { title: 'nav.sign-up' } },
];

export default AuthModuleRouter;
