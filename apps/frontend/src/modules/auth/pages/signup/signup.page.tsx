import React, { FC, useCallback, useEffect, useState } from 'react';
import SignUpForm from '../../components/signup-form/signup-form.component';
import { AuthReasonEnum, ConfirmationCodeDto } from '@boilerplate/shared';
import ConfirmationForm from '../../components/confirmation-form/confirmation-form.component';
import DocumentTitle from '../../../_core/components/_ui/document-title/document-title.component';
import { useRegisterMutation, useSendOtpMutation } from '../../../../store/api/auth.api';
import {
	REGISTER_CACHE_KEY,
	VERIFY_CACHE_KEY
} from '../../constants/auth-cache.constants';
import { SignUpFormDto } from '../../models/sign-up-form.dto';
import { Box } from '@mui/material';
import { containerStyles } from './signup.styles';
import { useLangParam } from '../../hooks/use-lang-param.hook';
import { useReferral } from '../../../users';
import { getErrorStatusCode, getFieldFromConflictError } from '../../../_core/utils/error.utils';

interface FormsState {
	activeForm: 'profile' | 'code';
	profile: Partial<SignUpFormDto>;
}

export const SignUpPage: FC = () => {
	useLangParam();
	const { referralId } = useReferral();

	const [register, { error: registerError, reset: resetRegister }] = useRegisterMutation({
		fixedCacheKey: REGISTER_CACHE_KEY
	});

	const [sendOtp, { error: otpError, reset: resetOtp }] = useSendOtpMutation({
		fixedCacheKey: VERIFY_CACHE_KEY
	});

	const [{ activeForm, profile }, setFormsState] = useState<FormsState>({
		activeForm: 'profile',
		profile: {
			email: '',
			name: '',
			phoneNumber: '',
			companyName: ''
		}
	});

	const handleSignupSubmit = useCallback(async (profile: SignUpFormDto, markError: (field?: string) => void) => {
		try {
			await sendOtp({
				phoneNumber: profile.phoneNumber,
				email: profile.email,
				reason: AuthReasonEnum.SignUp
			}).unwrap();

			setFormsState({
				activeForm: 'code',
				profile
			});
		} catch (error) {
			const status = getErrorStatusCode(error as Error);

			if (status === 409) {
				const field = getFieldFromConflictError(error as Error);

				markError(field ?? undefined);
			}
		}
	}, [sendOtp]);

	const goToSignup = useCallback(() => {
		setFormsState(state => ({
			...state,
			activeForm: 'profile'
		}));
	}, []);

	const handleCodeSubmit = useCallback(async ({ code }: ConfirmationCodeDto, markError: () => void) => {
		try {
			await register({
				...(profile as SignUpFormDto),
				code,
				referralId: referralId ?? undefined
			}).unwrap();
		} catch {
			markError();
		}
	}, [referralId, profile, register]);

	useEffect(() => () => {
			resetOtp();
			resetRegister();
		}, [resetOtp, resetRegister]);

	return (
		<Box sx={containerStyles}>
			<DocumentTitle />
			{activeForm === 'profile' && (
				<SignUpForm
					error={otpError}
					profile={profile}
					onSubmit={handleSignupSubmit}
				/>
			)}
			{activeForm === 'code' && (
				<ConfirmationForm
					phoneNumber={profile.phoneNumber}
					error={registerError}
					onSubmit={handleCodeSubmit}
					onBack={goToSignup}
				/>
			)}
			<div>

			</div>
		</Box>
	);
};

export default SignUpPage;
