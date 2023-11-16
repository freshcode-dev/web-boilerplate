import React, { FC, useCallback, useEffect, useState } from 'react';
import { Box, Container } from '@mui/material';
import { DocumentTitle } from '../../../_core/components/_ui/document-title';
import { useRegisterWithEmailMutation } from '../../../../store/api/auth.api';
import { REGISTER_CACHE_KEY } from '../../constants/auth-cache.constants';
import { containerStyles } from './signup-with-email.styles';
import { useLangParam } from '../../hooks/use-lang-param.hook';
import { SignUpWithEmailFormData } from '../../models/sign-up-form.dto';
import { SignUpWithEmailForm } from '../../components/signup-form';
import { GoogleAuthButton } from '../../components/_ui/google-auth-button';
import { googleAuthRowStyles } from '../login-with-email/login-with-email.styles';

interface FormsState {
	profile: Partial<SignUpWithEmailFormData>;
}

export const SignUpWithEmailPage: FC = () => {
	useLangParam();

	const [register, { error: registerError, reset: resetRegister }] = useRegisterWithEmailMutation({
		fixedCacheKey: REGISTER_CACHE_KEY,
	});

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

	useEffect(
		() => () => {
			resetRegister();
		},
		[resetRegister]
	);

	return (
		<Container sx={containerStyles}>
			<DocumentTitle />

			<SignUpWithEmailForm profile={profile} onSubmit={handleSignupSubmit} error={registerError} />

			<Box sx={googleAuthRowStyles}>
				<GoogleAuthButton />
			</Box>
		</Container>
	);
};

export default SignUpWithEmailPage;
