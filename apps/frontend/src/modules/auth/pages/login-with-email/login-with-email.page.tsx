import React, { FC, useCallback, useEffect, useState } from 'react';
import { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { SerializedError } from '@reduxjs/toolkit';
import { Box, Container } from '@mui/material';
import { useSignInWithEmailMutation } from '../../../../store/api/auth.api';
import { SIGN_IN_CACHE_KEY } from '../../constants/auth-cache.constants';
import { containerStyles, googleAuthRowStyles, wrapperStyles } from './login-with-email.styles';
import { useLangParam } from '../../hooks/use-lang-param.hook';
import { SignInWithEmailDto } from '@boilerplate/shared';
import { LoginWithEmailForm } from '../../components/login-form';
import { GoogleAuthButton } from '../../components/_ui/google-auth-button';
import { getErrorStatusCode } from '../../../_core/utils/error.utils';

const LoginWithEmailPage: FC = () => {
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

export default LoginWithEmailPage;
