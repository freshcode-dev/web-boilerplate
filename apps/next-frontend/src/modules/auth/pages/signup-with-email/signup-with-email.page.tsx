import React, { useCallback, useEffect, useState } from 'react';
import { Box, Container } from '@mui/material';
import { useRegisterWithEmailMutation, useSendOtpMutation } from '@/store/api/auth.api';
import { getErrorStatusCode, getFieldFromHttpError } from '../../../_core/utils/error.utils';
import { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { SerializedError } from '@reduxjs/toolkit';
import UnauthorizedArea from '@/modules/_core/areas/unauthorized-area/unauthorized-area.component';
import { NextPageWithMeta, PageDefinition } from '@/modules/_core/types';
import { AuthReasonEnum, ConfirmationCodeDto, SignUpWithEmailDto } from '@boilerplate/shared';
import { useLangParam } from '@/modules/_core/hooks';
import { REGISTER_CACHE_KEY, VERIFY_CACHE_KEY } from '@/modules/auth/constants';
import { containerStyles, googleAuthRowStyles, wrapperStyles } from './signup-with-email.styles';
import { SignUpWithEmailForm } from '@/modules/auth/components/signup-form';
import { CodeConfirmationForm } from '@/modules/auth/components/code-confirmation-form';
import { GoogleAuthButton } from '../../components/google-auth-button';
import { SIGNUP_PAGE_DESCRIPTION, SIGNUP_PAGE_TITLE } from 'src/constants/seo.constants';
import { NamespacesEnum } from '@/constants';

interface FormsState {
	activeForm: 'data' | 'code';
	profile: Partial<SignUpWithEmailDto>;
	rememberMe: boolean;
}

export const SignUpWithEmailPage: NextPageWithMeta = () => {
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
		rememberMe: true
	});

	const handleRegisterFormSubmit = useCallback(
		async (form: SignUpWithEmailDto, markError: (field?: string) => void) => {
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
					rememberMe: state.rememberMe
				}));
			} catch (error) {
				const status = getErrorStatusCode(error as Error);

				if (status === 409) {
					const field = getFieldFromHttpError(error as Error);

					markError(field ?? '');
				} else {
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
			<Box sx={wrapperStyles}>
				{activeForm === 'data' && (
					<SignUpWithEmailForm profile={profile} onSubmit={handleRegisterFormSubmit} error={otpError} />
				)}
				{activeForm === 'code' && (
					<CodeConfirmationForm
						reason={AuthReasonEnum.SignUp}
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

SignUpWithEmailPage.layout = UnauthorizedArea;

SignUpWithEmailPage.seo = (t) => ({
	title: SIGNUP_PAGE_TITLE(t),
	description: SIGNUP_PAGE_DESCRIPTION(t),
});

export const SignUpWithEmailPageDefinition: PageDefinition = {
	namespaces: [NamespacesEnum.SignUp],
	requiresAuth: false,
};

export default SignUpWithEmailPage;
