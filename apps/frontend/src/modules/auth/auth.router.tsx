import React from 'react';
import { RouteObject } from 'react-router-dom';
import LoginWithPhonePage from './pages/login-with-phone/login-with-phone.page';
import LoginWithEmailPage from './pages/login-with-email/login-with-email.page';
import SignUpWithEmailPage from './pages/signup-with-email/signup-with-email.page';
import { AuthRoutes } from '../../constants/routes';

export const AuthModuleRouter: RouteObject[] = [
	{ path: AuthRoutes.loginPhone, element: <LoginWithPhonePage />, handle: { title: 'nav.sign-in' } },
	{ path: AuthRoutes.loginEmail, element: <LoginWithEmailPage />, handle: { title: 'nav.sign-in' } },
	{ path: AuthRoutes.signUp, element: <SignUpWithEmailPage />, handle: { title: 'nav.sign-up' } },
];

export default AuthModuleRouter;
