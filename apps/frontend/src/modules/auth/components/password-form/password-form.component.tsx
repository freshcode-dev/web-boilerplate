import React, { FC, useCallback } from 'react';
import { Box, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { FormControlsContainer } from '../_ui/form-controls';
import { CoreButton } from '../../../_core/components/_ui/core-button';
import { useForm } from 'react-hook-form';
import { classValidatorResolver } from '@hookform/resolvers/class-validator';
import { PasswordDto } from '@boilerplate/shared';
import { SerializedError } from '@reduxjs/toolkit';
import { FetchBaseQueryError } from '@reduxjs/toolkit/query/react';
import { formElementStyles, titleStyles } from '../login-form/login-form.styles';
import { LoginErrorLabel } from '../login-form';
import { CorePasswordInput } from '../../../_core/components/_ui/core-password-input';
import { ForgotPasswordLabel } from '../_ui/forgot-password-label';

const resolver = classValidatorResolver(PasswordDto);

export interface PasswordFormProps {
	error?: SerializedError | FetchBaseQueryError;
	onSubmit(value: PasswordDto, markError: () => void): Promise<void> | void;
	onBack(): void;
}

export const PasswordForm: FC<PasswordFormProps> = (props) => {
	const { error, onBack, onSubmit } = props;

	const [t] = useTranslation();

	const {
		handleSubmit,
		setError,
		register,
		formState: { errors, isSubmitting, isDirty, isSubmitted, isValid },
	} = useForm<PasswordDto>({ resolver });

	const disableSubmit = !isValid && (isDirty || isSubmitted);

	const handleFormSubmit = useCallback(
		async (values: PasswordDto) =>
			onSubmit(values, () => {
				setError('password', { type: 'invalidPassword' });
			}),
		[onSubmit, setError]
	);

	return (
		<Box component="form" noValidate onSubmit={handleSubmit(handleFormSubmit)}>
			<Typography variant="h1" sx={titleStyles}>
				{t('sign-in.enter-password')}
			</Typography>
			<CorePasswordInput
				fullWidth
				id="password"
				onlyShowOnMouseDown
				requiredMark
				label={t('sign-in.sign-in-form.password')}
				{...register('password')}
				error={!!errors.password}
			/>
			<Box sx={formElementStyles}>
				<Box />
				<ForgotPasswordLabel />
			</Box>
			<LoginErrorLabel error={error} />
			<FormControlsContainer>
				<CoreButton variant="secondary" sx={{ mr: 1.5, width: 115 }} onClick={onBack} disabled={isSubmitting}>
					{t('sign-in.sign-in-form.back')}
				</CoreButton>
				<CoreButton sx={{ ml: 1.5, width: 115 }} type="submit" loading={isSubmitting} disabled={disableSubmit}>
					{t('sign-in.sign-in-form.confirm')}
				</CoreButton>
			</FormControlsContainer>
		</Box>
	);
};
