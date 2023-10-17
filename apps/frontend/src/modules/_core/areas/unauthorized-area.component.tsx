import React, { FC } from 'react';
import { Outlet } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { usePageTitle } from '../hooks';

const UnauthorizedArea: FC = () => {
	const pageTitle = usePageTitle()

	return (
		<>
			<Helmet title={pageTitle}>
				<meta
					name="viewport"
					content="width=device-width, maximum-scale=1, minimum-scale=1, initial-scale=1, user-scalable=no"
				/>
			</Helmet>
			<Outlet />
		</>
	);
}

export default UnauthorizedArea;
