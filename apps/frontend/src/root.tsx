import React, { FC, Suspense, lazy } from 'react';
import { useRoutes } from 'react-router-dom';
import { NotFoundPage } from './modules/_core';
import { RequireAuth, RequireUnauthorized, AuthorizedPage, useAuthSubscription } from './modules/auth';
import RouterSuspense from './modules/_core/components/router-suspense/router-suspense.component';

const AuthorizedArea = lazy(async () => import('./modules/_core/areas/authorized-area.component'));
const UnauthorizedArea = lazy(async () => import('./modules/_core/areas/unauthorized-area.component'));
const AuthModuleRouter = lazy(async () => import('./modules/auth/auth.router'));
const StyledExamplesRouter = lazy(async () => import('./modules/styles-examples/styled-examples.router'));

const Root: FC = () => {
	useAuthSubscription();

	const routes = useRoutes([
		{
			path: '/',
			element: <RequireAuth><AuthorizedArea /></RequireAuth>,
			children: [
				{ index: true, element: <AuthorizedPage /> },
				{ path: '/styles-examples/*', element: <StyledExamplesRouter /> }
			]
		},
		{
			element: <RequireUnauthorized><UnauthorizedArea /></RequireUnauthorized>,
			children: [
				{ path: 'auth/*', element: <AuthModuleRouter /> }
			]
		},
		{ path: '*', element: <NotFoundPage /> },
	]);

	return (
		<Suspense fallback={<RouterSuspense />}>
			{routes}
		</Suspense>
	);
};

export default Root;
