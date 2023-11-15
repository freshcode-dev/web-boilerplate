import React, { FC, useCallback, useEffect, useState } from 'react';
import { Box, Container } from '@mui/material';
import { useRegisterWithEmailMutation, useSendOtpMutation } from '../../../../store/api/auth.api';
import { REGISTER_CACHE_KEY, VERIFY_CACHE_KEY } from '../../constants/auth-cache.constants';
import { DocumentTitle } from '../../../_core/components/_ui/document-title';
import { containerStyles, googleAuthRowStyles, wrapperStyles } from './signup-with-email.styles';
import { useLangParam } from '../../hooks/use-lang-param.hook';
import { SignUpWithEmailForm } from '../../components/signup-form';
import { GoogleAuthButton } from '../../components/_ui/google-auth-button';
import { AuthReasonEnum, ConfirmationCodeDto, SignUpWithEmailDto } from '@boilerplate/shared';
import { getErrorStatusCode } from '../../../_core/utils/error.utils';
import { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { SerializedError } from '@reduxjs/toolkit';
import { CodeConfirmationForm } from '../../components/code-confirmation-form';

interface FormsState {
	activeForm: 'data' | 'code';
	profile: Partial<SignUpWithEmailDto>;
}

export const SignUpWithEmailPage: FC = () => {
	useLangParam();

	const [register, { reset: resetRegister }] = useRegisterWithEmailMutation({
		fixedCacheKey: REGISTER_CACHE_KEY,
	});

	const [sendOtp, { reset: resetOtp }] = useSendOtpMutation({
		fixedCacheKey: VERIFY_CACHE_KEY,
	});

	const [otpError, setOtpError] = useState<FetchBaseQueryError | SerializedError | undefined>();
	const [registerError, setRegisterError] = useState<FetchBaseQueryError | SerializedError | undefined>();

	const [{ activeForm, profile }, setFormsState] = useState<FormsState>({
		activeForm: 'data',
		profile: {
			email: '',
			name: '',
			phoneNumber: '',
		},
	});

	const handleRegisterFormSubmit = useCallback(
		async (form: SignUpWithEmailDto, markError: () => void) => {
			try {
				const { email, phoneNumber } = form;

				await sendOtp({
					reason: AuthReasonEnum.SignUp,
					phoneNumber,
					email,
				}).unwrap();

				setFormsState((state) => ({
					activeForm: 'code',
					profile: {
						...state.profile,
						...form,
					},
				}));
			} catch (error) {
				const status = getErrorStatusCode(error as Error);

				if (status === 404) {
					markError();
				}

				setOtpError(error as Error);
			}
		},
		[sendOtp]
	);

	const handleCodeSubmit = useCallback(
		async ({ code }: ConfirmationCodeDto, markError: (field?: string) => void) => {
			try {
				await register({
					...(profile as SignUpWithEmailDto),
					code,
				}).unwrap();
			} catch (error) {
				markError();

				setRegisterError(error as Error);
			}
		},
		[register, profile]
	);

	const goToRegisterForm = useCallback(() => {
		setFormsState((state) => ({
			...state,
			activeForm: 'data',
		}));
		setOtpError(undefined);
		setRegisterError(undefined);
	}, []);

	useEffect(
		() => () => {
			resetOtp();
			resetRegister();
		},
		[resetOtp, resetRegister]
	);

	return (
		<Container sx={containerStyles}>
			<DocumentTitle />

			<Box sx={wrapperStyles}>
				{activeForm === 'data' && (
					<SignUpWithEmailForm profile={profile} onSubmit={handleRegisterFormSubmit} error={otpError} />
				)}
				{activeForm === 'code' && (
					<CodeConfirmationForm
						email={profile.email}
						error={registerError}
						onSubmit={handleCodeSubmit}
						onBack={goToRegisterForm}
					/>
				)}
			</Box>

			<Box sx={googleAuthRowStyles}>
				<GoogleAuthButton />
			</Box>
		</Container>
	);
};

export default SignUpWithEmailPage;
