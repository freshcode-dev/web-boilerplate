import React, { useCallback, useEffect, useState } from 'react';
import { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { SerializedError } from '@reduxjs/toolkit';
import { Box, Container } from '@mui/material';
import { containerStyles, googleAuthRowStyles, wrapperStyles } from './login-with-email.styles';
import { LoginWithEmailForm } from '../../components/login-form';
import { getErrorStatusCode } from '../../../_core/utils/error.utils';
import { NextPageWithMeta, PageDefinition } from '@/modules/_core/types';
import { useLangParam } from '@/modules/_core/hooks';
import { useSignInWithEmailMutation } from '@/store/api/auth.api';
import { SignInWithEmailDto } from '@boilerplate/shared';
import { SIGN_IN_CACHE_KEY } from '@/modules/auth/constants';
import { GoogleAuthButton } from '@/modules/auth/components/google-auth-button';
import UnauthorizedArea from '@/modules/_core/areas/unauthorized-area/unauthorized-area.component';
import { LOGIN_PAGE_DESCRIPTION, LOGIN_PAGE_TITLE, NamespacesEnum } from '@/constants';

export const LoginWithEmailPage: NextPageWithMeta = () => {
	useLangParam();

	const [signInEmail, { reset: resetSignIn }] = useSignInWithEmailMutation({
		fixedCacheKey: SIGN_IN_CACHE_KEY,
	});

	const [signInError, setSignInError] = useState<FetchBaseQueryError | SerializedError | undefined>();

	const handleLoginFormSubmit = useCallback(
		async ({ password, email, rememberMe }: SignInWithEmailDto, markError: () => void) => {
			try {
				if (!email || !password) return;

				await signInEmail({
					email,
					password,
					rememberMe,
				}).unwrap();
			} catch (error) {
				const status = getErrorStatusCode(error as Error);

				if (status === 401) {
					markError();
				}

				setSignInError(error as Error);
			}
		},
		[signInEmail]
	);

	useEffect(
		() => () => {
			resetSignIn();
		},
		[resetSignIn]
	);

	return (
		<Container sx={containerStyles}>
			<Box sx={wrapperStyles}>
				<LoginWithEmailForm onSubmit={handleLoginFormSubmit} error={signInError} rememberMe />
			</Box>

			<Box sx={googleAuthRowStyles}>
				<GoogleAuthButton />
			</Box>
		</Container>
	);
};

LoginWithEmailPage.layout = UnauthorizedArea;

LoginWithEmailPage.seo = (t) => ({
	title: LOGIN_PAGE_TITLE(t),
	description: LOGIN_PAGE_DESCRIPTION(t),
});

export const LoginWithEmailPageDefinition: PageDefinition = {
	namespaces: [NamespacesEnum.SignIn],
	requiresAuth: false
};
