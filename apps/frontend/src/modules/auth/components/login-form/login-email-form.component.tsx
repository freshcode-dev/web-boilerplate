import React, { FC, useCallback } from 'react';
import { Box, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { FetchBaseQueryError } from '@reduxjs/toolkit/query/react';
import { SerializedError } from '@reduxjs/toolkit';
import { useForm } from 'react-hook-form';
import { CoreButton } from '../../../_core/components/_ui/core-button';
import { classValidatorResolver } from '@hookform/resolvers/class-validator';
import { FormControlsContainer } from '../_ui/form-controls';
import { errorMessage } from '../../../_core/utils/lang.utils';
import { LoginErrorLabel } from './login-error-label.component';
import { formElementStyles, titleStyles } from './login-form.styles';
import { EmailDto, RememberMeDto } from '@boilerplate/shared';
import { CoreTextField } from '../../../_core/components/_ui/core-textfield';
import { CoreLabeledCheckbox } from '../../../_core/components/_ui/core-labeled-checkbox';
import { ForgotPasswordLabel } from '../_ui/forgot-password-label';

const resolver = classValidatorResolver(EmailDto);

export interface LoginWithEmailFormProps {
	email?: string;
	rememberMe?: boolean;
	error?: FetchBaseQueryError | SerializedError;
	onSubmit(values: EmailDto & RememberMeDto, markError: () => void): void;
}

export const LoginWithEmailForm: FC<LoginWithEmailFormProps> = (props) => {
	const { error, onSubmit, email, rememberMe } = props;

	const [t] = useTranslation();

	const {
		register,
		handleSubmit,
		watch,
		setError,
		formState: { errors, isValid, isSubmitted, isDirty, isSubmitting },
	} = useForm<EmailDto & RememberMeDto>({
		resolver,
		defaultValues: {
			email,
			rememberMe,
		},
	});

	const watchRememberMe = watch('rememberMe');

	const disableSubmit = !isValid && (isDirty || isSubmitted);

	const handleFormSubmit = useCallback(
		(values: EmailDto & RememberMeDto) => {
			onSubmit(values, () => {
				setError('email', { type: 'isEmail' });
			});
		},
		[setError, onSubmit]
	);

	return (
		<Box component="form" noValidate onSubmit={handleSubmit(handleFormSubmit)}>
			<Typography variant="h3" sx={titleStyles}>
				{t('sign-in.account-sign-in')}
			</Typography>
			<CoreTextField
				sx={formElementStyles}
				{...register('email')}
				fullWidth
				requiredMark
				id="email"
				label={t('sign-in.sign-in-form.email')}
				error={!!errors.email}
				helperText={errorMessage(t, errors.email?.type)}
				autoComplete="email"
			/>
			<Box sx={formElementStyles}>
				<CoreLabeledCheckbox {...register('rememberMe')} checked={watchRememberMe} label={t('sign-in.sign-in-form.remember-me')} />
				<ForgotPasswordLabel />
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
