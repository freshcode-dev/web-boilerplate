import React, { FC, lazy } from 'react';
import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom';
import { NotFoundPage } from './modules/_core';
import {
	RequireAuth,
	RequireUnauthorized,
	AuthorizedPage,
	useAuthSubscription,
	AuthModuleRouter
} from './modules/auth';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import RootSuspense from './modules/_core/components/router-suspense/root-suspense.component';
import { StyledExamplesRouter } from './modules/styles-examples';

const AuthorizedArea = lazy(async () => import('./modules/_core/areas/authorized-area.component'));
const UnauthorizedArea = lazy(async () => import('./modules/_core/areas/unauthorized-area.component'));

const Root: FC = () => {
	useAuthSubscription();
	const { t } = useTranslation();

	/**
	 * The function is supposed to contain any routes restriction logic
	 */
	const getAppRouters = () => ([
		{ index: true, element: <Navigate to="demo" /> },
		{ path: 'demo', element: <AuthorizedPage />, handle: { title: 'nav.demo' } },
		{ path: 'styles-examples/*', children: StyledExamplesRouter, handle: { title: 'nav.styled' }  }
	]);

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
			children: [
				{ path: 'demo', element: <AuthorizedPage />, handle: { title: 'nav.demo' } }
			]
		}
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
