import React, { FC, useCallback } from 'react';
import { Box, Typography } from '@mui/material';
import { CoreTextField } from '../../../_core/components/_ui/core-textfield';
import { CoreButton } from '../../../_core/components/_ui/core-button';
import { PhoneInput } from '../../../_core/components/_ui/phone-input';
import { useForm } from 'react-hook-form';
import { classValidatorResolver } from '@hookform/resolvers/class-validator';
import { SerializedError } from '@reduxjs/toolkit';
import { FetchBaseQueryError } from '@reduxjs/toolkit/query/react';
import { SignupErrorLabel } from './signup-error-label.component';
import { titleStyles } from '../login-form/login-form.styles';
import { textFieldWrapperStyles } from './signup-form.styles';
import { CorePasswordInput } from '../../../_core/components/_ui/core-password-input';
import { SignUpWithEmailDto } from '@boilerplate/shared';
import { useTranslation } from 'next-i18next';
import { FormControlsContainer } from '@/modules/auth/components/form-controls';
import { NamespacesEnum } from '@/constants';

const resolver = classValidatorResolver(SignUpWithEmailDto);

export interface SignUpWithEmailFormProps {
	error?: FetchBaseQueryError | SerializedError;
	profile: Partial<SignUpWithEmailDto>;
	onSubmit(values: SignUpWithEmailDto, markError: (field?: string) => void): void;
}

export const SignUpWithEmailForm: FC<SignUpWithEmailFormProps> = (props) => {
	const { error, onSubmit, profile } = props;

	const [t] = useTranslation([NamespacesEnum.SignUp]);

	const {
		control,
		handleSubmit,
		setError,
		register,
		formState: { isSubmitting, isSubmitted, isDirty, isValid, errors },
	} = useForm<SignUpWithEmailDto>({
		resolver,
		defaultValues: profile,
	});

	const disableSubmit = !isValid && (isDirty || isSubmitted);

	const handleFormSubmit = useCallback(
		(values: SignUpWithEmailDto) => {
			onSubmit({ ...values }, (field?: string) => {
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
			<Typography variant="h3" sx={titleStyles}>
				{t('account-register')}
			</Typography>
			<CoreTextField
				fullWidth
				id="full-name"
				controlSx={textFieldWrapperStyles}
				label={t('registration-form.full-name')}
				placeholder={t('registration-form.full-name-ph') ?? ''}
				{...register('name')}
				error={!!errors.name}
			/>
			<PhoneInput
				fullWidth
				id="phone-number"
				controlSx={textFieldWrapperStyles}
				label={t('registration-form.phone-number')}
				control={control}
				name="phoneNumber"
				error={!!errors.phoneNumber}
			/>
			<CoreTextField
				fullWidth
				id="email"
				placeholder={t('registration-form.email-ph') ?? ''}
				label={t('registration-form.email')}
				controlSx={textFieldWrapperStyles}
				{...register('email')}
				error={!!errors.email}
			/>
			<CorePasswordInput
				fullWidth
				id="password"
				placeholder={t('registration-form.password-ph') ?? ''}
				label={t('registration-form.new-password')}
				controlSx={textFieldWrapperStyles}
				{...register('password')}
				error={!!errors.password}
				autoComplete='off'
			/>
			<CorePasswordInput
				fullWidth
				id="confirm-password"
				placeholder={t('registration-form.confirm-password') ?? ''}
				label={t('registration-form.confirm-password')}
				{...register('confirmPassword')}
				error={!!errors.confirmPassword}
				autoComplete='off'
			/>
			<SignupErrorLabel error={error} />
			<FormControlsContainer>
				<CoreButton loading={isSubmitting} type="submit" disabled={disableSubmit} sx={{ minWidth: 104 }}>
					{t('registration-form.next')}
				</CoreButton>
			</FormControlsContainer>
		</Box>
	);
};
