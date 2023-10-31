import React, { FC, useCallback, useEffect, useState } from 'react';
import { Box } from '@mui/material';
import LoginForm from "../../components/login-form/login-form.component";
import LoginFooter from '../../components/_ui/login-footer/login-footer.component';
import ConfirmationForm from "../../components/confirmation-form/confirmation-form.component";
import DocumentTitle from "../../../_core/components/_ui/document-title/document-title.component";
import { useSendOtpMutation, useSignInWithPhoneMutation } from "../../../../store/api/auth.api";
import { SIGN_IN_CACHE_KEY, VERIFY_CACHE_KEY } from "../../constants/auth-cache.constants";
import { wrapperStyles } from "./login.styles";
import { useLangParam } from "../../hooks/use-lang-param.hook";
import { getErrorStatusCode } from '../../../_core/utils/error.utils';
import { AuthReasonEnum, ConfirmationCodeDto, PhoneDto } from '@boilerplate/shared';

interface FormsState {
	activeForm: 'phone' | 'code';
	phoneNumber: string | null;
}

const LoginPage: FC = () => {
	useLangParam();

	const [signInPhone, { error: signInError, reset: resetSignIn }] = useSignInWithPhoneMutation({
		fixedCacheKey: SIGN_IN_CACHE_KEY
	});

	const [sendOtp, { error: otpError, reset: resetOtp }] = useSendOtpMutation({
		fixedCacheKey: VERIFY_CACHE_KEY
	});

	const [{ activeForm, phoneNumber }, setFormsState] = useState<FormsState>({
		activeForm: 'phone',
		phoneNumber: null
	});

	const handleLoginFormSubmit = useCallback(async ({ phoneNumber }: PhoneDto, markError: () => void) => {
		try {
			await sendOtp({
				phoneNumber,
				reason: AuthReasonEnum.SignIn
			}).unwrap();

			setFormsState({
				activeForm: 'code',
				phoneNumber
			});
		} catch (error) {
			const status = getErrorStatusCode(error as Error);

			if (status === 404) {
				markError();
			}
		}
	}, [sendOtp]);

	const goToLoginForm = useCallback(() => {
		setFormsState(state => ({
			...state,
			activeForm: 'phone'
		}));
	}, []);

	const handleCodeSubmit = useCallback(async ({ code }: ConfirmationCodeDto, markError: () => void) => {
		try {
			await signInPhone({
				code,
				phoneNumber: phoneNumber as string
			}).unwrap();
		} catch {
			markError();
		}
	}, [signInPhone, phoneNumber]);

	useEffect(() => () => {
		resetSignIn();
		resetOtp();
	}, [resetOtp, resetSignIn]);

	return (
		<Box
			sx={{
				display: 'flex',
				flexDirection: 'column',
				flex: 1,
			}}
		>
			<DocumentTitle />
			<Box sx={wrapperStyles}>
				{activeForm === 'phone' && (
					<LoginForm
						error={otpError}
						onSubmit={handleLoginFormSubmit}
						phoneNumber={phoneNumber ?? undefined}
					/>
				)}
				{activeForm === 'code' && (
					<ConfirmationForm
						phoneNumber={phoneNumber}
						error={signInError}
						onSubmit={handleCodeSubmit}
						onBack={goToLoginForm}
					/>
				)}
			</Box>
			<LoginFooter/>
		</Box>
	);
};

export default LoginPage;
