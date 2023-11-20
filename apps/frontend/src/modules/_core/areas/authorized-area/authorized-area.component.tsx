import React, { FC, Suspense } from 'react';
import { Outlet } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Box, Paper } from '@mui/material';
import { usePageTitle } from '../../hooks';
import { AreaProviders } from '../area-providers.component';
import { SuspenseSpinner } from '../../components/router-suspense';
import { getAppWrapperStyles, getMainPaperStyles, getMainStyles } from './authorized-area.styles';
import { useIsMobile } from '../../hooks/useis-mobile.hook';
import SystemBottomTabs from '../../components/system-bottom-tabs/system-bottom-tabs.component';
import SystemHeaderMobile from '../../components/system-header-mobile/system-header-mobile.component';
import SystemHeader from '../../components/system-header/system-header.component';
import SystemDrawer from '../../components/system-drawer/system-drawer.component';
import { GSIClientContextProvider, assignGoogleAccount } from '../../../auth';
import { googleApiClientId, isGoogleAuthEnabled } from '../../../../constants';

const AuthorizedArea: FC = () => {
	const pageTitle = usePageTitle();

	const isMobile = useIsMobile();

	return (
		<GSIClientContextProvider
			isEnabled={isGoogleAuthEnabled}
			clientId={googleApiClientId}
			callback={assignGoogleAccount}
		>
			<AreaProviders>
				<Helmet title={pageTitle}>
					<meta
						name="viewport"
						content="width=device-width, maximum-scale=1, minimum-scale=1, initial-scale=1, user-scalable=no"
					/>
				</Helmet>

				<Box
					sx={{
						display: 'flex',
						flexDirection: 'column',
						height: '100%',
					}}
				>
					<Box sx={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
						{!isMobile && <SystemDrawer />}
						<Box sx={getAppWrapperStyles(isMobile)}>
							<Box component="header">{isMobile ? <SystemHeaderMobile /> : <SystemHeader />}</Box>
							<Box component="main" sx={getMainStyles(isMobile)}>
								<Paper elevation={0} sx={getMainPaperStyles(isMobile)}>
									<Suspense fallback={<SuspenseSpinner full />}>
										<Outlet />
									</Suspense>
								</Paper>
							</Box>
						</Box>
					</Box>
					{isMobile && <SystemBottomTabs />}
				</Box>
			</AreaProviders>
		</GSIClientContextProvider>
	);
};

export default AuthorizedArea;
