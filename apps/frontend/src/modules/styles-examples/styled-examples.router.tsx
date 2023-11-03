import React, { lazy } from 'react';
import { Navigate, RouteObject } from 'react-router-dom';
import { lazyRetry } from '../_core/utils';
import { StylesExamplesRoutes } from '../../constants/routes';

const StylesExamplesPage = lazy(async () =>
	lazyRetry(async () => import('./pages/styles-examples/styles-examples.page'))
);

export const StylesExamplesRouter: RouteObject[] = [
	{ index: true, element: <Navigate to={StylesExamplesRoutes.page} replace /> },
	{ path: StylesExamplesRoutes.page, element: <StylesExamplesPage /> },
];

export default StylesExamplesRouter;
