import React, { FC, useCallback, useEffect, useState } from 'react';
import { Box, Container } from '@mui/material';
import { useRegisterWithEmailMutation } from '../../../../store/api/auth.api';
import { REGISTER_CACHE_KEY } from '../../constants/auth-cache.constants';
import { containerStyles } from './signup-with-email.styles';
import { useLangParam } from '../../hooks/use-lang-param.hook';
import { SignUpWithEmailFormData } from '../../models/sign-up-form.dto';
import { SignUpWithEmailForm } from '../../components/signup-form';
import { GoogleAuthButton } from '../../components/_ui/google-auth-button';
import { googleAuthRowStyles } from '../login-with-email/login-with-email.styles';
import { getErrorStatusCode, getFieldFromConflictError } from '../../../_core/utils/error.utils';

interface FormsState {
	profile: Partial<SignUpWithEmailFormData>;
}

export const SignUpWithEmailPage: FC = () => {
	useLangParam();

	const [register, { reset: resetRegister }] = useRegisterWithEmailMutation({
		fixedCacheKey: REGISTER_CACHE_KEY,
	});

	const [signUpError, setSignUpError] = useState<Error | null>(null);

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
			} catch (error) {
				const status = getErrorStatusCode(error as Error);

				if (status === 409) {
					const field = getFieldFromConflictError(error as Error);

					markError(field ?? '');
				} else {
					markError();
				}

				setSignUpError(error as Error);
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
			<SignUpWithEmailForm profile={profile} onSubmit={handleSignupSubmit} error={signUpError ?? undefined} />

			<Box sx={googleAuthRowStyles}>
				<GoogleAuthButton />
			</Box>
		</Container>
	);
};

export default SignUpWithEmailPage;
