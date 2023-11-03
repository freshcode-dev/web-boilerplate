import React, { FC, useCallback } from 'react';
import { Box, Typography } from '@mui/material';
import CoreButton from '../../../_core/components/_ui/core-button/core-button.component';
import { useTranslation } from 'react-i18next';
import { classValidatorResolver } from '@hookform/resolvers/class-validator';
import { FormControlsContainer } from '../_ui/form-controls/form-controls-container.component';
import { useForm } from 'react-hook-form';
import { errorMessage } from '../../../_core/utils/lang.utils';
import { FetchBaseQueryError } from '@reduxjs/toolkit/query/react';
import { SerializedError } from '@reduxjs/toolkit';
import LoginErrorLabel from './login-error-label.component';
import { titleStyles } from './login-form.styles';
import { EmailDto, RememberMeDto } from '@boilerplate/shared';
import { CoreTextField } from '../../../_core/components/_ui/core-textfield';
import { CoreLabeledCheckbox } from '../../../_core/components/_ui/core-labeled-checkbox/core-labeled-checkbox.component';

const resolver = classValidatorResolver(EmailDto);

export interface LoginWithPhoneFormProps {
	error?: FetchBaseQueryError | SerializedError;
	email?: string;
	onSubmit(values: EmailDto & RememberMeDto, markError: () => void): void;
}

const LoginWithEmailForm: FC<LoginWithPhoneFormProps> = (props) => {
	const { error, onSubmit, email } = props;

	const [t] = useTranslation();

	const {
		register,
		handleSubmit,
		setError,
		formState: { errors, isValid, isSubmitted, isDirty, isSubmitting },
	} = useForm<EmailDto & RememberMeDto>({
		resolver,
		defaultValues: {
			email,
		},
	});

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
			<Typography variant="h1" sx={titleStyles}>
				{t('sign-in.account-sign-in')}
			</Typography>
			<CoreTextField
				{...register('email')}
				fullWidth
				requiredMark
				id="email"
				label={t('sign-in.sign-in-form.email')}
				error={!!errors.email}
				helperText={errorMessage(t, errors.email?.type)}
				autoComplete="email"
			/>
			<CoreLabeledCheckbox {...register('rememberMe')} label={t('sign-in.sign-in-form.remember-me')} />
			<LoginErrorLabel error={error} />
			<FormControlsContainer>
				<CoreButton type="submit" disabled={disableSubmit} loading={isSubmitting} sx={{ minWidth: 104 }}>
					{t('sign-in.sign-in-form.confirm')}
				</CoreButton>
			</FormControlsContainer>
		</Box>
	);
};

export default LoginWithEmailForm;
