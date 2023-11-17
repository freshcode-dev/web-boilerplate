import React, { FC, useCallback } from 'react';
import { Box, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { FormControlsContainer } from '../_ui/form-controls';
import { CoreButton } from '../../../_core/components/_ui/core-button';
import { useForm, Controller } from 'react-hook-form';
import { OtpInput } from '../../../_core/components/_ui/otp-input';
import { classValidatorResolver } from '@hookform/resolvers/class-validator';
import { AuthReasonEnum, ConfirmationCodeDto, VERIFICATION_CODE_LENGTH } from '@boilerplate/shared';
import { SerializedError } from '@reduxjs/toolkit';
import { FetchBaseQueryError } from '@reduxjs/toolkit/query/react';
import { ConfirmationErrorLabel } from './code-confirmation-error-label.component';
import { titleStyles, labelStyles } from './code-confirmation-form.styles';
import { useSendOtpMutation } from '../../../../store/api/auth.api';

const resolver = classValidatorResolver(ConfirmationCodeDto);

interface CodeConfirmationFormProps {
	reason: AuthReasonEnum;
	phoneNumber?: string | null;
	email?: string | null;
	error?: SerializedError | FetchBaseQueryError;
	onSubmit(value: ConfirmationCodeDto, markError: () => void): Promise<void> | void;
	onBack?(): void;
}

export const CodeConfirmationForm: FC<CodeConfirmationFormProps> = (props) => {
	const { reason, email, phoneNumber, error, onBack, onSubmit } = props;

	const [t] = useTranslation();

	const {
		handleSubmit,
		control,
		setError,
		formState: { errors, isSubmitting, isDirty, isSubmitted, isValid },
	} = useForm<ConfirmationCodeDto>({ resolver });

	const [sendOtp, { error: otpError, isLoading: isOtpSending, reset }] = useSendOtpMutation();

	const disableSubmit = !isValid && (isDirty || isSubmitted);

	const handleFormSubmit = useCallback(
		async (values: ConfirmationCodeDto) => {
			reset();

			return onSubmit({ ...values }, () => {
				setError('code', { type: 'invalidCodeError' });
			});
		},
		[onSubmit, reset, setError]
	);

	const handleResend = useCallback(async () => {
		try {
			if (!phoneNumber || !email) {
				return;
			}

			await sendOtp({
				reason,
				email,
				phoneNumber,
			}).unwrap();
		} catch {
			setError('code', { type: 'otpResendError' });
		}
	}, [email, phoneNumber, sendOtp, setError]);

	return (
		<Box component="form" noValidate onSubmit={handleSubmit(handleFormSubmit)}>
			<Typography variant="h3" sx={titleStyles}>
				{t('auth-confirmation.enter-code')}
			</Typography>
			<Typography variant="body2" sx={labelStyles}>
				{t('auth-confirmation.confirmation-flow-description')}
			</Typography>
			<Controller
				control={control}
				name="code"
				render={({ field: { onChange, value } }) => (
					<OtpInput numInputs={VERIFICATION_CODE_LENGTH} onChange={onChange} value={value} error={!!errors.code} />
				)}
			/>
			<ConfirmationErrorLabel
				error={error}
				otpError={otpError}
				onResend={handleResend}
				submitting={isSubmitting || isOtpSending}
			/>
			<FormControlsContainer>
				{onBack && (
					<CoreButton variant="secondary" sx={{ mr: 1.5, width: 115 }} onClick={onBack} disabled={isSubmitting}>
						{t('auth-confirmation.confirm-form.back')}
					</CoreButton>
				)}
				<CoreButton sx={{ ml: 1.5, width: 115 }} type="submit" loading={isSubmitting} disabled={disableSubmit}>
					{t('auth-confirmation.confirm-form.confirm')}
				</CoreButton>
			</FormControlsContainer>
		</Box>
	);
};
