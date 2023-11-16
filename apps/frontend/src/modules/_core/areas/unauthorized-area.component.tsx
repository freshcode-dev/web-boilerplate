import React, { FC } from 'react';
import { Outlet } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { usePageTitle } from '../hooks';
import { AreaProviders } from './area-providers.component';
import { GSIClientContextProvider } from '../../auth/contexts';
import { googleApiClientId, isGoogleAuthEnabled } from '../../../constants';
import { authWithGoogleToken } from '../../auth';

const UnauthorizedArea: FC = () => {
	const pageTitle = usePageTitle();

	return (
		<>
			<Helmet title={pageTitle}>
				<meta
					name="viewport"
					content="width=device-width, maximum-scale=1, minimum-scale=1, initial-scale=1, user-scalable=no"
				/>
			</Helmet>

			<GSIClientContextProvider
				isEnabled={isGoogleAuthEnabled}
				clientId={googleApiClientId}
				callback={authWithGoogleToken}
			>
				<AreaProviders>
					<Outlet />
				</AreaProviders>
			</GSIClientContextProvider>
		</>
	);
};

export default UnauthorizedArea;
