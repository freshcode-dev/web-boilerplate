import React, { FC, useCallback } from 'react';
import { classValidatorResolver } from '@hookform/resolvers/class-validator';
import { FetchBaseQueryError } from '@reduxjs/toolkit/query/react';
import { SerializedError } from '@reduxjs/toolkit';
import { Box, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import CoreButton from '../../../_core/components/_ui/core-button/core-button.component';
import { FormControlsContainer } from '../_ui/form-controls/form-controls-container.component';
import { PhoneInput } from '../../../_core/components/_ui/phone-input';
import { errorMessage } from '../../../_core/utils/lang.utils';
import LoginErrorLabel from './login-error-label.component';
import { formElementStyles, linkStyles, titleStyles } from './login-form.styles';
import { PhoneDto, RememberMeDto } from '@boilerplate/shared';
import { CoreLabeledCheckbox } from '../../../_core/components/_ui/core-labeled-checkbox/core-labeled-checkbox.component';
import { AuthRoutes } from '../../constants';

const resolver = classValidatorResolver(PhoneDto);

export interface LoginWithPhoneFormProps {
	error?: FetchBaseQueryError | SerializedError;
	phoneNumber?: string;
	rememberMe?: boolean;
	onSubmit(values: PhoneDto & RememberMeDto, markError: () => void): void;
}

const LoginWithPhoneForm: FC<LoginWithPhoneFormProps> = (props) => {
	const { error, onSubmit, phoneNumber, rememberMe } = props;

	const [t] = useTranslation();

	const {
		register,
		control,
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
			<Typography variant="h1" sx={titleStyles}>
				{t('sign-in.account-sign-in')}
			</Typography>
			<Box
				sx={linkStyles}
				component={(props) => <Link {...props} to={AuthRoutes.LoginEmail} children="Login using email" />}
			/>
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
				<CoreLabeledCheckbox {...register('rememberMe')} label={t('sign-in.sign-in-form.remember-me')} />
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

export default LoginWithPhoneForm;
