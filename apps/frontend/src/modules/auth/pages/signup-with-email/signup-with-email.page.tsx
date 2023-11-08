import React, { FC, useCallback, useEffect, useState } from 'react';
import DocumentTitle from '../../../_core/components/_ui/document-title/document-title.component';
import { useAuthWithGoogleTokenMutation, useRegisterWithEmailMutation } from '../../../../store/api/auth.api';
import { REGISTER_CACHE_KEY } from '../../constants/auth-cache.constants';
import { Box, Container } from '@mui/material';
import { containerStyles } from './signup-with-email.styles';
import { useLangParam } from '../../hooks/use-lang-param.hook';
import { SignUpWithEmailFormData } from '../../models/sign-up-form.dto';
import SignUpWithEmailForm from '../../components/signup-form/signup-email-form.component';
import RegisterFooter from '../../components/_ui/register-footer/register-footer.component';
import GoogleAuthButton from '../../components/_ui/google-auth-button/google-auth-button.component';

interface FormsState {
	profile: Partial<SignUpWithEmailFormData>;
}

export const SignUpWithEmailPage: FC = () => {
	useLangParam();

	const [register, { error: registerError, reset: resetRegister }] = useRegisterWithEmailMutation({
		fixedCacheKey: REGISTER_CACHE_KEY,
	});

	const [authWithGoogleToken, { reset: resetAuthWithGoogleToken }] = useAuthWithGoogleTokenMutation();

	const [{ profile }] = useState<FormsState>({
		profile: {
			email: '',
			name: '',
			phoneNumber: '',
		},
	});

	const handleSignupSubmit = useCallback(
		async (profile: SignUpWithEmailFormData, markError: (field?: string) => void) => {
			try {
				await register({
					...(profile as SignUpWithEmailFormData),
				}).unwrap();
			} catch {
				markError();
			}
		},
		[register]
	);
	const handleRegisterWithGoogle = useCallback(async (response: { credential: string }) => {
		const idToken = response.credential;

		await authWithGoogleToken(idToken);
	}, [authWithGoogleToken]);

	useEffect(
		() => () => {
			resetRegister();
			resetAuthWithGoogleToken();
		},
		[resetRegister, resetAuthWithGoogleToken]
	);

	return (
		<Container sx={containerStyles}>
			<DocumentTitle />
			<SignUpWithEmailForm profile={profile} onSubmit={handleSignupSubmit} error={registerError} />
			<Box>
				<GoogleAuthButton onSuccess={handleRegisterWithGoogle} />
			</Box>
			<RegisterFooter route="email" />
		</Container>
	);
};

export default SignUpWithEmailPage;
