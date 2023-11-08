import React, { FC, useCallback, useEffect, useState } from 'react';
import { Box, Container } from '@mui/material';
import LoginWithPhoneForm from '../../components/login-form/login-phone-form.component';
import LoginFooter from '../../components/_ui/login-footer/login-footer.component';
import PhoneConfirmationForm from '../../components/phone-confirmation-form/phone-confirmation-form.component';
import DocumentTitle from '../../../_core/components/_ui/document-title/document-title.component';
import { useAuthWithGoogleTokenMutation, useSendOtpMutation, useSignInWithPhoneMutation } from '../../../../store/api/auth.api';
import { SIGN_IN_CACHE_KEY, VERIFY_CACHE_KEY } from '../../constants/auth-cache.constants';
import { containerStyles, wrapperStyles } from './login-with-phone.styles';
import { useLangParam } from '../../hooks/use-lang-param.hook';
import { getErrorStatusCode } from '../../../_core/utils/error.utils';
import { AuthReasonEnum, ConfirmationCodeDto, PhoneDto, RememberMeDto } from '@boilerplate/shared';
import { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { SerializedError } from '@reduxjs/toolkit';
import GoogleAuthButton from '../../components/_ui/google-auth-button/google-auth-button.component';

interface FormsState {
	activeForm: 'phone' | 'code';
	phoneNumber: string | null;
	rememberMe: boolean;
}

const LoginWithPhonePage: FC = () => {
	useLangParam();

	const [signInPhone, { reset: resetSignIn }] = useSignInWithPhoneMutation({
		fixedCacheKey: SIGN_IN_CACHE_KEY,
	});

	const [sendOtp, { reset: resetOtp }] = useSendOtpMutation({
		fixedCacheKey: VERIFY_CACHE_KEY,
	});

	const [authWithGoogleToken, { reset: resetAuthWithGoogleToken }] = useAuthWithGoogleTokenMutation();

	const [otpError, setOtpError] = useState<FetchBaseQueryError | SerializedError | undefined>();
	const [signInError, setSignInError] = useState<FetchBaseQueryError | SerializedError | undefined>();

	const [{ activeForm, phoneNumber, rememberMe }, setFormsState] = useState<FormsState>({
		activeForm: 'phone',
		phoneNumber: null,
		rememberMe: false,
	});

	const handleLoginFormSubmit = useCallback(
		async ({ phoneNumber, rememberMe }: PhoneDto & RememberMeDto, markError: () => void) => {
			try {
				await sendOtp({
					phoneNumber,
					reason: AuthReasonEnum.SignIn,
				}).unwrap();

				setFormsState({
					activeForm: 'code',
					phoneNumber,
					rememberMe,
				});
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

	const goToLoginForm = useCallback(() => {
		setFormsState((state) => ({
			...state,
			activeForm: 'phone',
		}));
		setOtpError(undefined);
		setSignInError(undefined);
	}, []);

	const handleCodeSubmit = useCallback(
		async ({ code }: ConfirmationCodeDto, markError: () => void) => {
			try {
				await signInPhone({
					code,
					phoneNumber: phoneNumber as string,
					rememberMe,
				}).unwrap();
			} catch (error) {
				markError();
				setSignInError(error as Error);
			}
		},
		[signInPhone, phoneNumber, rememberMe]
	);

	const handleLoginWithGoogle = useCallback(async (response: { credential: string }) => {
		const idToken = response.credential;

		await authWithGoogleToken(idToken);
	}, [authWithGoogleToken]);

	useEffect(
		() => () => {
			resetSignIn();
			resetOtp();
			resetAuthWithGoogleToken();
		},
		[resetOtp, resetSignIn, resetAuthWithGoogleToken]
	);

	return (
		<Container sx={containerStyles}>
			<DocumentTitle />
			<Box sx={wrapperStyles}>
				{activeForm === 'phone' && (
					<LoginWithPhoneForm
						error={otpError}
						onSubmit={handleLoginFormSubmit}
						phoneNumber={phoneNumber ?? undefined}
					/>
				)}
				{activeForm === 'code' && (
					<PhoneConfirmationForm
						phoneNumber={phoneNumber}
						error={signInError}
						onSubmit={handleCodeSubmit}
						onBack={goToLoginForm}
					/>
				)}
			</Box>
			<Box>
				<GoogleAuthButton onSuccess={handleLoginWithGoogle} />
			</Box>
			<LoginFooter />
		</Container>
	);
};

export default LoginWithPhonePage;
