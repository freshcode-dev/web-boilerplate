import React, { FC } from 'react';
import {Navigate, useRoutes} from 'react-router-dom';
import StylesExamplesPage from './pages/styles-examples/styles-examples.page';

export const StyledExamplesRouter: FC = () => useRoutes([
	{ index: true, element: <Navigate to="page" replace /> },
	{ path: '/page', element: <StylesExamplesPage /> },
]);

export default StyledExamplesRouter;
