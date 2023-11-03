import React, { FC, useCallback, useEffect, useState } from 'react';
import { Box, Container } from '@mui/material';
import LoginFooter from '../../components/_ui/login-footer/login-footer.component';
import DocumentTitle from '../../../_core/components/_ui/document-title/document-title.component';
import { useSignInWithEmailMutation } from '../../../../store/api/auth.api';
import { SIGN_IN_CACHE_KEY } from '../../constants/auth-cache.constants';
import { containerStyles, wrapperStyles } from './login-with-email.styles';
import { useLangParam } from '../../hooks/use-lang-param.hook';
import { getErrorStatusCode } from '../../../_core/utils/error.utils';
import { EmailDto, PasswordDto, RememberMeDto } from '@boilerplate/shared';
import LoginWithEmailForm from '../../components/login-form/login-email-form.component';
import PasswordForm from '../../components/password-form/password-form.component';
import { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { SerializedError } from '@reduxjs/toolkit';

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
		rememberMe: false,
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
				{activeForm === 'email' && <LoginWithEmailForm onSubmit={handleLoginFormSubmit} email={email ?? undefined} />}
				{activeForm === 'password' && (
					<PasswordForm error={signInError} onSubmit={handlePasswordSubmit} onBack={goToLoginForm} />
				)}
			</Box>
			<LoginFooter />
		</Container>
	);
};

export default LoginWithEmailPage;
