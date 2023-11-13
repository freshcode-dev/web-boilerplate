import React, { FC } from 'react';
import { Outlet } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { usePageTitle } from '../../hooks';
import { AreaProviders } from '../area-providers.component';
import { GSIClientContextProvider, assignGoogleAccount } from '../../../auth';
import { googleApiClientId, isGoogleAuthEnabled } from '../../../../constants';

const AuthorizedArea: FC = () => {
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
				callback={assignGoogleAccount}
			>
				<AreaProviders>
					<Outlet />
				</AreaProviders>
			</GSIClientContextProvider>
		</>
	);
};

export default AuthorizedArea;
