import React, { FC, Suspense } from 'react';
import { useRoutes } from 'react-router-dom';
import RouterSuspense from '../_core/components/router-suspense/router-suspense.component';
import LoginPage from './pages/login/login.page';
import SignUpPage from './pages/signup/signup.page';

export const AuthModuleRouter: FC = () => {
	const routes = useRoutes([
		{ path: '/login', element: <LoginPage /> },
		{ path: '/signup', element: <SignUpPage /> },
	]);

	return (
		<Suspense fallback={<RouterSuspense />}>
			{routes}
		</Suspense>
	);
};

export default AuthModuleRouter;
