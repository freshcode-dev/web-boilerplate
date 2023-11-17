import React, { FC, lazy } from 'react';
import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom';
import { NotFoundPage } from './modules/_core';
import { RequireAuth, RequireUnauthorized, useAuthSubscription, AuthModuleRouter } from './modules/auth';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { RootSuspense } from './modules/_core/components/router-suspense';
import { StyledExamplesRouter } from './modules/styles-examples';
import { ProfileModuleRouter } from './modules/profile/profile.router';
import { RootRoutes } from './constants';

const AuthorizedArea = lazy(async () => import('./modules/_core/areas/authorized-area/authorized-area.component'));
const UnauthorizedArea = lazy(async () => import('./modules/_core/areas/unauthorized-area/unauthorized-area.component'));

const Root: FC = () => {
	useAuthSubscription();
	const [t] = useTranslation();

	/**
	 * The function is supposed to contain any routes restriction logic
	 */
	const getAppRouters = () => [
		{ index: true, element: <Navigate to="/demo" /> },
		{ path: `${RootRoutes.StylesExamples}/*`, children: StyledExamplesRouter, handle: { title: 'nav.styled' } },
		{
			children: ProfileModuleRouter,
		},
	];

	const routes = createBrowserRouter([
		{
			path: '/',
			element: (
				<RequireAuth>
					<RootSuspense>
						<AuthorizedArea />
					</RootSuspense>
				</RequireAuth>
			),
			children: getAppRouters()
		},
		{
			element: (
				<RequireUnauthorized>
					<RootSuspense>
						<UnauthorizedArea />
					</RootSuspense>
				</RequireUnauthorized>
			),
			children: AuthModuleRouter
		},
		{ path: '*', element: <NotFoundPage /> },
	]);

	return (
		<>
			<Helmet title={t('nav.root-title') ?? ''}>
				<meta
					name="viewport"
					content="width=device-width, maximum-scale=1, minimum-scale=1, initial-scale=1, user-scalable=no"
				/>
			</Helmet>
			<RouterProvider router={routes} />
		</>
	);
};

export default Root;
