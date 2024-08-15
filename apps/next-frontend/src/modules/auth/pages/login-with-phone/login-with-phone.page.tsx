import { LOGIN_PAGE_DESCRIPTION, LOGIN_PAGE_TITLE, NamespacesEnum } from '@/constants';
import UnauthorizedArea from '@/modules/_core/areas/unauthorized-area/unauthorized-area.component';
import {
	useSendOtpMutation,
	useSignInWithPhoneMutation,
} from '@/store/api/auth.api';
import { Box, Container } from '@mui/material';
import { SerializedError } from '@reduxjs/toolkit';
import { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { useCallback, useEffect, useState } from 'react';
import { CodeConfirmationForm } from '../../components/code-confirmation-form';
import {
	containerStyles, googleAuthRowStyles,
	wrapperStyles
} from './login-with-phone.styles';
import { NextPageWithMeta, PageDefinition } from '@/modules/_core/types';
import { SIGN_IN_CACHE_KEY, VERIFY_CACHE_KEY } from '@/modules/auth/constants';
import { useLangParam } from '@/modules/_core/hooks';
import { LoginWithPhoneForm } from '../../components/login-form';
import { GoogleAuthButton } from '../../components/google-auth-button';
import { AuthReasonEnum, ConfirmationCodeDto, PhoneDto, RememberMeDto } from '@boilerplate/shared';
import { getErrorStatusCode } from '@/modules/_core/utils/error.utils';

interface FormsState {
	activeForm: 'data' | 'code';
	phoneNumber: string | null;
	rememberMe: boolean;
}

export const LoginWithPhonePage: NextPageWithMeta = () => {
	useLangParam();

	const [signInPhone, { reset: resetSignIn }] = useSignInWithPhoneMutation({
		fixedCacheKey: SIGN_IN_CACHE_KEY,
	});

	const [sendOtp, { reset: resetOtp }] = useSendOtpMutation({
		fixedCacheKey: VERIFY_CACHE_KEY,
	});

	const [otpError, setOtpError] = useState<FetchBaseQueryError | SerializedError | undefined>();
	const [signInError, setSignInError] = useState<FetchBaseQueryError | SerializedError | undefined>();

	const [{ activeForm, phoneNumber, rememberMe }, setFormsState] = useState<FormsState>({
		activeForm: 'data',
		phoneNumber: null,
		rememberMe: true,
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
			activeForm: 'data',
		}));
		setOtpError(undefined);
		setSignInError(undefined);
	}, []);

	const handleCodeSubmit = useCallback(
		async ({ code }: ConfirmationCodeDto, markError: () => void) => {
			try {
				if (!phoneNumber) return;

				await signInPhone({
					code,
					phoneNumber,
					rememberMe,
				}).unwrap();
			} catch (error) {
				markError();
				setSignInError(error as Error);
			}
		},
		[signInPhone, phoneNumber, rememberMe]
	);

	useEffect(
		() => () => {
			resetSignIn();
			resetOtp();
		},
		[resetOtp, resetSignIn]
	);

	return (
		<Container sx={containerStyles}>
			<Box sx={wrapperStyles}>
				{activeForm === 'data' && (
					<LoginWithPhoneForm
						phoneNumber={phoneNumber ?? undefined}
						rememberMe={rememberMe}
						onSubmit={handleLoginFormSubmit}
						error={otpError}
					/>
				)}
				{activeForm === 'code' && (
					<CodeConfirmationForm
						reason={AuthReasonEnum.SignIn}
						phoneNumber={phoneNumber}
						error={signInError}
						onSubmit={handleCodeSubmit}
						onBack={goToLoginForm}
					/>
				)}
			</Box>

			<Box sx={googleAuthRowStyles}>
				<GoogleAuthButton />
			</Box>
		</Container>
	);
};

LoginWithPhonePage.layout = UnauthorizedArea;

LoginWithPhonePage.seo = (t) => ({
	title: LOGIN_PAGE_TITLE(t),
	description: LOGIN_PAGE_DESCRIPTION(t),
});

export const LoginWithPhonePageDefinition: PageDefinition = {
	namespaces: [NamespacesEnum.SignIn],
	requiresAuth: false
};
