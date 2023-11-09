import React, { FC, useCallback } from 'react';
import { Box, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { FetchBaseQueryError } from '@reduxjs/toolkit/query/react';
import { SerializedError } from '@reduxjs/toolkit';
import { useForm } from 'react-hook-form';
import { CoreButton } from '../../../_core/components/_ui/core-button';
import { classValidatorResolver } from '@hookform/resolvers/class-validator';
import { FormControlsContainer } from '../_ui/form-controls';
import { PhoneInput } from '../../../_core/components/_ui/phone-input';
import { errorMessage } from '../../../_core/utils/lang.utils';
import { LoginErrorLabel } from './login-error-label.component';
import { formElementStyles, titleStyles } from './login-form.styles';
import { PhoneDto, RememberMeDto } from '@boilerplate/shared';
import { CoreLabeledCheckbox } from '../../../_core/components/_ui/core-labeled-checkbox';

const resolver = classValidatorResolver(PhoneDto);

export interface LoginWithPhoneFormProps {
	error?: FetchBaseQueryError | SerializedError;
	phoneNumber?: string;
	rememberMe?: boolean;
	onSubmit(values: PhoneDto & RememberMeDto, markError: () => void): void;
}

export const LoginWithPhoneForm: FC<LoginWithPhoneFormProps> = (props) => {
	const { error, onSubmit, phoneNumber, rememberMe } = props;

	const [t] = useTranslation();

	const {
		register,
		control,
		watch,
		handleSubmit,
		setError,
		formState: { errors, isValid, isSubmitted, isDirty, isSubmitting },
	} = useForm<PhoneDto & RememberMeDto>({
		resolver,
		defaultValues: {
			phoneNumber,
			rememberMe,
		},
	});

	const watchRememberMe = watch('rememberMe');

	const disableSubmit = !isValid && (isDirty || isSubmitted);

	const handleFormSubmit = useCallback(
		(values: PhoneDto & RememberMeDto) => {
			onSubmit(values, () => {
				setError('phoneNumber', { type: 'isPhoneNumber' });
			});
		},
		[setError, onSubmit]
	);

	return (
		<Box component="form" noValidate onSubmit={handleSubmit(handleFormSubmit)}>
			<Typography variant="h3" sx={titleStyles}>
				{t('sign-in.account-sign-in')}
			</Typography>
			<PhoneInput
				controlSx={formElementStyles}
				control={control}
				name="phoneNumber"
				fullWidth
				id="phone-number"
				label={t('sign-in.sign-in-form.phone-number')}
				error={!!errors.phoneNumber}
				helperText={errorMessage(t, errors.phoneNumber?.type)}
			/>
			<Box sx={formElementStyles}>
				<CoreLabeledCheckbox {...register('rememberMe')} checked={watchRememberMe} label={t('sign-in.sign-in-form.remember-me')} />
			</Box>
			<LoginErrorLabel error={error} />
			<FormControlsContainer>
				<CoreButton type="submit" disabled={disableSubmit} loading={isSubmitting} sx={{ minWidth: 104 }}>
					{t('sign-in.sign-in-form.confirm')}
				</CoreButton>
			</FormControlsContainer>
		</Box>
	);
};
