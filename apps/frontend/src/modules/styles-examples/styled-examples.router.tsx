import React, { lazy } from 'react';
import { Navigate, RouteObject } from 'react-router-dom';
import { lazyRetry } from '../_core/utils';

const StylesExamplesPage = lazy(async () => lazyRetry(async () => import('./pages/styles-examples/styles-examples.page')));

export const StyledExamplesRouter: RouteObject[] = [
	{ index: true, element: <Navigate to="page" replace /> },
	{ path: 'page', element: <StylesExamplesPage /> },
];

export default StyledExamplesRouter;
