import { FC, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { classValidatorResolver } from '@hookform/resolvers/class-validator';
import { useTranslation } from 'react-i18next';
import { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { SerializedError } from '@reduxjs/toolkit';
import { Box } from '@mui/material';
import { PhoneDto, RememberMeDto } from '@boilerplate/shared';
import { errorMessage } from '../../../_core/utils/lang.utils';
import { LoginErrorLabel } from '../login-form';
import { FormControlsContainer } from '../_ui/form-controls';
import { CoreButton } from '../../../_core/components/_ui/core-button';
import { formElementStyles } from '../login-form/login-form.styles';
import { PhoneInput } from '../../../_core/components/_ui/phone-input';
import { RememberMeCheckbox } from '../_ui/remember-me-checkbox';

const resolver = classValidatorResolver(PhoneDto);

export interface PhoneFormProps {
	phoneNumber?: string;
	rememberMe?: boolean;
	errorI18nKey?: string;
	error?: FetchBaseQueryError | SerializedError;
	showAdditionalActions?: boolean;
	validate?: boolean;
	onSubmit(values: PhoneDto & RememberMeDto, markError: () => void): Promise<void> | void;
}

export const PhoneForm: FC<PhoneFormProps> = (props) => {
	const { errorI18nKey, phoneNumber, rememberMe, error, validate, onSubmit, showAdditionalActions = true } = props;

	const [t] = useTranslation();

	const {
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
			onSubmit({ ...values }, () => {
				setError('phoneNumber', { type: 'isPhoneNumber' });
			});
		},
		[setError, onSubmit]
	);

	return (
		<Box component="form" noValidate={!validate} onSubmit={handleSubmit(handleFormSubmit)}>
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
			{showAdditionalActions && (
				<Box sx={formElementStyles} alignItems="center">
					<RememberMeCheckbox control={control} name="rememberMe" />
				</Box>
			)}
			<LoginErrorLabel error={error} errorI18nKey={errorI18nKey ?? 'sign-in.check-phone-or-register'} />
			<FormControlsContainer>
				<CoreButton type="submit" disabled={disableSubmit} loading={isSubmitting} sx={{ minWidth: 104 }}>
					{t('sign-in.sign-in-form.confirm')}
				</CoreButton>
			</FormControlsContainer>
		</Box>
	);
};
