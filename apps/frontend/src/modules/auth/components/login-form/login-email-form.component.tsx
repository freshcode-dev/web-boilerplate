import React, { FC, useCallback } from 'react';
import { Box, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { FormControlsContainer } from '../_ui/form-controls';
import { CoreButton } from '../../../_core/components/_ui/core-button';
import { errorMessage } from '../../../_core/utils/lang.utils';
import { LoginErrorLabel } from './login-error-label.component';
import { formElementStyles, titleStyles } from './login-form.styles';
import { SignInWithEmailDto } from '@boilerplate/shared';
import { CorePasswordInput } from '../../../_core/components/_ui/core-password-input';
import { classValidatorResolver } from '@hookform/resolvers/class-validator';
import { FetchBaseQueryError } from '@reduxjs/toolkit/query/react';
import { SerializedError } from '@reduxjs/toolkit';
import { CoreTextField } from '../../../_core/components/_ui/core-textfield';
import { RememberMeCheckbox } from '../_ui/remember-me-checkbox';
import { ForgotPasswordLabel } from '../_ui/forgot-password-label';

const resolver = classValidatorResolver(SignInWithEmailDto);

export interface LoginWithEmailFormProps {
	email?: string;
	rememberMe?: boolean;
	error?: FetchBaseQueryError | SerializedError;
	errorI18nKey?: string;
	onSubmit(values: SignInWithEmailDto, markError: (field?: string) => void): void;
}

export const LoginWithEmailForm: FC<LoginWithEmailFormProps> = (props) => {
	const { error, onSubmit, email, rememberMe, errorI18nKey } = props;

	const [t] = useTranslation();

	const {
		register,
		handleSubmit,
		control,
		setError,
		formState: { errors, isValid, isSubmitted, isDirty, isSubmitting },
	} = useForm<SignInWithEmailDto>({
		resolver,
		defaultValues: {
			email,
			rememberMe,
			password: '',
		},
	});

	const disableSubmit = !isValid && (isDirty || isSubmitted);

	const handleFormSubmit = useCallback(
		(values: SignInWithEmailDto) => {
			onSubmit({ ...values }, () => {
				setError('email', { type: 'invalidCredentials' });
				setError('password', { type: 'invalidCredentials' });
			});
		},
		[setError, onSubmit]
	);

	return (
		<Box component="form" onSubmit={handleSubmit(handleFormSubmit)}>
			<Typography variant="h3" sx={titleStyles}>
				{t('sign-in.account-sign-in')}
			</Typography>

			<CoreTextField
				{...register('email')}
				sx={formElementStyles}
				fullWidth
				requiredMark
				id="email"
				label={t('sign-in.sign-in-form.email')}
				error={!!errors.email}
				helperText={errorMessage(t, errors.email?.type)}
				autoComplete="email"
			/>
			<CorePasswordInput
				{...register('password')}
				fullWidth
				sx={formElementStyles}
				id="password"
				onlyShowOnMouseDown
				requiredMark
				label={t('sign-in.sign-in-form.password')}
				error={!!errors.password}
				helperText={errorMessage(t, errors.email?.type)}
			/>
			<Box sx={formElementStyles} alignItems="center">
				<RememberMeCheckbox control={control} name="rememberMe" />
				<ForgotPasswordLabel />
			</Box>
			<LoginErrorLabel error={error} errorI18nKey={errorI18nKey} />
			<FormControlsContainer>
				<CoreButton type="submit" disabled={disableSubmit} loading={isSubmitting} sx={{ minWidth: 104 }}>
					{t('sign-in.sign-in-form.confirm')}
				</CoreButton>
			</FormControlsContainer>
		</Box>
	);
};
