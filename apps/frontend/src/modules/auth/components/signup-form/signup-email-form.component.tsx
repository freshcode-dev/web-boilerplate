import React, { FC, useCallback } from 'react';
import { Box, Typography } from '@mui/material';
import { CoreTextField } from '../../../_core/components/_ui/core-textfield/core-textfield.component';
import CoreButton from '../../../_core/components/_ui/core-button/core-button.component';
import { useTranslation } from 'react-i18next';
import { FormControlsContainer } from '../_ui/form-controls/form-controls-container.component';
import { PhoneInput } from '../../../_core/components/_ui/phone-input/phone-input.component';
import { useForm } from 'react-hook-form';
import { classValidatorResolver } from '@hookform/resolvers/class-validator';
import { SerializedError } from '@reduxjs/toolkit';
import { FetchBaseQueryError } from '@reduxjs/toolkit/query/react';
import SignupErrorLabel from './signup-error-label.component';
import { titleStyles } from '../login-form/login-form.styles';
import { textFieldWrapperStyles } from './signup-form.styles';
import { SignUpWithEmailFormData } from '../../models/sign-up-form.dto';
import { CorePasswordInput } from '../../../_core/components/_ui/core-password-input';

const resolver = classValidatorResolver(SignUpWithEmailFormData);

export interface SignUpWithEmailFormProps {
	error?: FetchBaseQueryError | SerializedError;
	profile: Partial<SignUpWithEmailFormData>;
	onSubmit(values: SignUpWithEmailFormData, markError: () => void): void;
}

const SignUpWithEmailForm: FC<SignUpWithEmailFormProps> = (props) => {
	const { error, onSubmit, profile } = props;

	const [t] = useTranslation();

	const {
		control,
		handleSubmit,
		setError,
		register,
		formState: { isSubmitting, isSubmitted, isDirty, isValid, errors },
	} = useForm<SignUpWithEmailFormData>({
		resolver,
		defaultValues: profile,
	});

	const disableSubmit = !isValid && (isDirty || isSubmitted);

	const handleFormSubmit = useCallback(
		(values: SignUpWithEmailFormData) => {
			onSubmit(values, (field?: string) => {
				if (field === 'phoneNumber') {
					setError('phoneNumber', { type: 'isUniqueNumber' });
				} else if (field === 'email') {
					setError('email', { type: 'isUniqueEmail' });
				}
			});
		},
		[onSubmit, setError]
	);

	return (
		<Box component="form" noValidate onSubmit={handleSubmit(handleFormSubmit)}>
			<Typography variant="h1" sx={titleStyles}>
				{t('sign-up.account-register')}
			</Typography>
			<CoreTextField
				fullWidth
				id="full-name"
				controlSx={textFieldWrapperStyles}
				label={t('sign-up.registration-form.full-name')}
				placeholder={t('sign-up.registration-form.full-name-ph') ?? ''}
				{...register('name')}
				error={!!errors.name}
			/>
			<PhoneInput
				fullWidth
				id="phone-number"
				controlSx={textFieldWrapperStyles}
				label={t('sign-up.registration-form.phone-number')}
				control={control}
				name="phoneNumber"
				error={!!errors.phoneNumber}
			/>
			<CoreTextField
				fullWidth
				id="email"
				placeholder={t('sign-up.registration-form.email-ph') ?? ''}
				label={t('sign-up.registration-form.email')}
				controlSx={textFieldWrapperStyles}
				{...register('email')}
				error={!!errors.email}
			/>
			<CorePasswordInput
				fullWidth
				id="password"
				placeholder={t('sign-up.registration-form.password-ph') ?? ''}
				label={t('sign-up.registration-form.password')}
				controlSx={textFieldWrapperStyles}
				{...register('password')}
				error={!!errors.password}
			/>
			<CorePasswordInput
				fullWidth
				id="confirm-password"
				placeholder={t('sign-up.registration-form.confirmPassword') ?? ''}
				label={t('sign-up.registration-form.confirmPassword')}
				controlSx={textFieldWrapperStyles}
				{...register('confirmPassword')}
				error={!!errors.confirmPassword}
			/>
			<SignupErrorLabel error={error} />
			<FormControlsContainer>
				<CoreButton loading={isSubmitting} type="submit" disabled={disableSubmit} sx={{ minWidth: 104 }}>
					{t('sign-up.registration-form.confirm')}
				</CoreButton>
			</FormControlsContainer>
		</Box>
	);
};

export default SignUpWithEmailForm;
