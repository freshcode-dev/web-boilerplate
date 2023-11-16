import React, { FC, useCallback, useEffect, useState } from 'react';
import { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { SerializedError } from '@reduxjs/toolkit';
import { Box, Container } from '@mui/material';
import { DocumentTitle } from '../../../_core/components/_ui/document-title';
import { useSignInWithEmailMutation } from '../../../../store/api/auth.api';
import { SIGN_IN_CACHE_KEY } from '../../constants/auth-cache.constants';
import { containerStyles, googleAuthRowStyles, wrapperStyles } from './login-with-email.styles';
import { useLangParam } from '../../hooks/use-lang-param.hook';
import { getErrorStatusCode } from '../../../_core/utils/error.utils';
import { EmailDto, PasswordDto, RememberMeDto } from '@boilerplate/shared';
import { LoginWithEmailForm } from '../../components/login-form';
import { PasswordForm } from '../../components/password-form';
import { GoogleAuthButton } from '../../components/_ui/google-auth-button';

interface FormsState {
	activeForm: 'email' | 'password';
	email?: string | null;
	password?: string | null;
	rememberMe: boolean;
}

const LoginWithEmailPage: FC = () => {
	useLangParam();

	const [signInEmail, { reset: resetSignIn }] = useSignInWithEmailMutation({
		fixedCacheKey: SIGN_IN_CACHE_KEY,
	});

	const [signInError, setSignInError] = useState<FetchBaseQueryError | SerializedError | undefined>();

	const [{ activeForm, email, rememberMe }, setFormsState] = useState<FormsState>({
		activeForm: 'email',
		email: null,
		password: null,
		rememberMe: true,
	});

	const handleLoginFormSubmit = useCallback(async ({ email, rememberMe }: EmailDto & RememberMeDto, markError: () => void) => {
		try {
			setFormsState({
				activeForm: 'password',
				email,
				rememberMe,
			});
		} catch (error) {
			const status = getErrorStatusCode(error as Error);

			if (status === 404) {
				markError();
			}

			setSignInError(error as Error);
		}
	}, []);

	const goToLoginForm = useCallback(() => {
		setFormsState((state) => ({
			...state,
			activeForm: 'email',
		}));
		setSignInError(undefined);
	}, []);

	const handlePasswordSubmit = useCallback(
		async ({ password }: PasswordDto, markError: () => void) => {
			try {
				if (!email) return;

				await signInEmail({
					email,
					password,
					rememberMe,
				}).unwrap();
			} catch (error) {
				markError();
				setSignInError(error as Error);
			}
		},
		[signInEmail, email, rememberMe]
	);

	useEffect(
		() => () => {
			resetSignIn();
		},
		[resetSignIn]
	);

	return (
		<Container sx={containerStyles}>
			<DocumentTitle />

			<Box sx={wrapperStyles}>
				{activeForm === 'email' && <LoginWithEmailForm onSubmit={handleLoginFormSubmit} email={email ?? undefined} rememberMe={rememberMe} />}
				{activeForm === 'password' && (
					<PasswordForm error={signInError} onSubmit={handlePasswordSubmit} onBack={goToLoginForm} />
				)}
			</Box>

			<Box sx={googleAuthRowStyles}>
				<GoogleAuthButton />
			</Box>
		</Container>
	);
};

export default LoginWithEmailPage;
