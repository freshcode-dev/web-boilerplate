import React, { FC, useMemo } from 'react';
import { Outlet, useMatch } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { usePageTitle } from '../../hooks';
import { AreaProviders } from '../area-providers.component';
import { GSIClientContextProvider } from '../../../auth/contexts';
import { googleApiClientId, isGoogleAuthEnabled } from '../../../../constants';
import {
	AuthRoutes,
	REGISTER_CACHE_KEY,
	SIGN_IN_CACHE_KEY,
	VERIFY_CACHE_KEY,
	authWithGoogleToken,
} from '../../../auth';
import { CoreNavTabs, NavTab } from '../../components/_ui/core-nav-tabs';
import { Box, Grid, Theme, useMediaQuery } from '@mui/material';
import {
	useRegisterWithEmailMutation,
	useRegisterWithPhoneMutation,
	useSendOtpMutation,
	useSignInWithEmailMutation,
	useSignInWithPhoneMutation,
} from '../../../../store/api/auth.api';
import {
	appLogoStyles,
	gridContainerStyles,
	headerStyles,
	outletContainerStyles,
	paperStyles,
	tabsStyles,
} from './unauthorized-area.styles';
import { AppLogo } from '../../constants/icons.constants';
import { Images } from '../../constants/images.constants';
import { CoverImage } from '../../components/_ui/cover-image';

const UnauthorizedArea: FC = () => {
	const pageTitle = usePageTitle();

	const [t] = useTranslation();

	const isLoginPage = useMatch('/auth/login');
	const showWallImage = useMediaQuery((theme: Theme) => theme.breakpoints.up('md'));

	const coverImage = useMemo(() => (isLoginPage ? Images.AuthCoverSignIn : Images.AuthCoverSignUp), [isLoginPage]);

	const [, { isLoading: registeringWithEmail }] = useRegisterWithEmailMutation({
		fixedCacheKey: REGISTER_CACHE_KEY,
	});
	const [, { isLoading: registeringWithPhone }] = useRegisterWithPhoneMutation({
		fixedCacheKey: REGISTER_CACHE_KEY,
	});

	const [, { isLoading: signingInWithEmail }] = useSignInWithEmailMutation({
		fixedCacheKey: SIGN_IN_CACHE_KEY,
	});
	const [, { isLoading: signingInWithPhone }] = useSignInWithPhoneMutation({
		fixedCacheKey: SIGN_IN_CACHE_KEY,
	});

	const [, { isLoading: verifying }] = useSendOtpMutation({
		fixedCacheKey: VERIFY_CACHE_KEY,
	});

	const disableTabs =
		registeringWithEmail || registeringWithPhone || signingInWithEmail || signingInWithPhone || verifying;

	const tabs = useMemo<NavTab[]>(
		() => [
			{
				to: AuthRoutes.LoginEmail,
				label: t('nav.sign-in-with-email'),
				id: 'auth-sign-in-email-panel',
				replace: true,
				disabled: disableTabs,
			},
			{
				to: AuthRoutes.LoginPhone,
				label: t('nav.sign-in-with-phone'),
				id: 'auth-sign-in-phone-panel',
				replace: true,
				disabled: disableTabs,
			},
			{
				to: AuthRoutes.SignUp,
				label: t('nav.sign-up'),
				id: 'auth-sign-up-panel',
				replace: true,
				disabled: disableTabs,
			},
		],
		[t, disableTabs]
	);

	return (
		<GSIClientContextProvider
			isEnabled={isGoogleAuthEnabled}
			clientId={googleApiClientId}
			callback={authWithGoogleToken}
		>
			<AreaProviders>
				<Helmet title={pageTitle}>
					<meta
						name="viewport"
						content="width=device-width, maximum-scale=1, minimum-scale=1, initial-scale=1, user-scalable=no"
					/>
				</Helmet>
				<Grid component="main" container columnSpacing={1} sx={gridContainerStyles}>
					<Grid item xs={showWallImage ? 6 : 12} sx={{ maxHeight: '100%' }}>
						<Box sx={paperStyles}>
							<Box sx={outletContainerStyles}>
								<Box sx={headerStyles}>
									<Box component={AppLogo} sx={appLogoStyles} />
								</Box>
								<Box sx={tabsStyles}>
									<CoreNavTabs tabs={tabs} />
								</Box>

								<Outlet />
							</Box>
						</Box>
					</Grid>

					{showWallImage && (
						<Grid item xs={6} sx={{ display: 'flex', maxHeight: '100%' }}>
							{coverImage ? <CoverImage src={coverImage} /> : null}
						</Grid>
					)}
				</Grid>
			</AreaProviders>
		</GSIClientContextProvider>
	);
};

export default UnauthorizedArea;
