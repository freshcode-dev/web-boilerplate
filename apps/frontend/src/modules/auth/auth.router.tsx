import React from 'react';
import { RouteObject } from 'react-router-dom';
import LoginPage from './pages/login/login.page';
import SignUpPage from './pages/signup/signup.page';

export const AuthModuleRouter: RouteObject[] = [
	{ path: '/auth/login', element: <LoginPage />, handle: { title: 'nav.sign-in' } },
	{ path: '/auth/sign-up', element: <SignUpPage />, handle: { title: 'nav.sign-up' } },
];

export default AuthModuleRouter;
