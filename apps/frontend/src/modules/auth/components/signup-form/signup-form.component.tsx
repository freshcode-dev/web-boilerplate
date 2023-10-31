import React, { FC, useCallback } from 'react';
import { Box, Typography } from '@mui/material';
import { CoreTextField } from '../../../_core/components/_ui/core-textfield/core-textfield.component';
import CoreButton from '../../../_core/components/_ui/core-button/core-button.component';
import { useTranslation } from 'react-i18next';
import { FormControlsContainer } from '../_ui/form-controls/form-controls-container.component';
import { PhoneInput } from '../../../_core/components/_ui/phone-input/phone-input.component';
import { useForm } from 'react-hook-form';
import { classValidatorResolver } from '@hookform/resolvers/class-validator';
import { SignUpFormDto } from '../../models/sign-up-form.dto';
import { SerializedError } from '@reduxjs/toolkit';
import { FetchBaseQueryError } from '@reduxjs/toolkit/query/react';
import SignupErrorLabel from './signup-error-label.component';
import { titleStyles } from '../login-form/login-form.styles';
import { textFieldWrapperStyles } from './signup-form.styles';

const resolver = classValidatorResolver(SignUpFormDto);

interface SignUpFormProps {
	error?: FetchBaseQueryError | SerializedError;
	profile: Partial<SignUpFormDto>;
	onSubmit(values: SignUpFormDto, markError: () => void): void;
}

const SignUpForm: FC<SignUpFormProps> = (props) => {
	const { error, onSubmit, profile } = props;

	const [t] = useTranslation();

	const {
		control,
		handleSubmit,
		setError,
		register,
		formState: { isSubmitting, isSubmitted, isDirty, isValid, errors },
	} = useForm<SignUpFormDto>({
		resolver,
		defaultValues: profile,
	});

	const disableSubmit = !isValid && (isDirty || isSubmitted);

	const handleFormSubmit = useCallback(
		(values: SignUpFormDto) => {
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
				id="company-name"
				controlSx={textFieldWrapperStyles}
				label={t('sign-up.registration-form.company-name')}
				placeholder={t('sign-up.registration-form.company-name-ph') ?? ''}
				{...register('companyName')}
				error={!!errors.companyName}
			/>
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
				{...register('email')}
				error={!!errors.email}
			/>
			{error && <SignupErrorLabel error={error} />}
			<FormControlsContainer>
				<CoreButton loading={isSubmitting} type="submit" disabled={disableSubmit} sx={{ minWidth: 104 }}>
					{t('sign-up.registration-form.confirm')}
				</CoreButton>
			</FormControlsContainer>
		</Box>
	);
};

export default SignUpForm;
