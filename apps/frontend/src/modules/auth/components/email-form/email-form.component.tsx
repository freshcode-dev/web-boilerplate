import { FC, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { classValidatorResolver } from '@hookform/resolvers/class-validator';
import { useTranslation } from 'react-i18next';
import { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { SerializedError } from '@reduxjs/toolkit';
import { Box } from '@mui/material';
import { EmailDto, RememberMeDto } from '@boilerplate/shared';
import { CoreTextField } from '../../../_core/components/_ui/core-textfield';
import { errorMessage } from '../../../_core/utils/lang.utils';
import { LoginErrorLabel } from '../login-form';
import { FormControlsContainer } from '../_ui/form-controls';
import { CoreButton } from '../../../_core/components/_ui/core-button';
import { ForgotPasswordLabel } from '../_ui/forgot-password-label';
import { formElementStyles } from '../login-form/login-form.styles';
import { RememberMeCheckbox } from '../_ui/remember-me-checkbox';

const resolver = classValidatorResolver(EmailDto);

export interface EmailFormProps {
	email?: string;
	rememberMe?: boolean;
	errorI18nKey?: string;
	error?: FetchBaseQueryError | SerializedError;
	showAdditionalActions?: boolean;
	validate?: boolean;
	onSubmit(values: EmailDto & RememberMeDto, markError: () => void): Promise<void> | void;
}

export const EmailForm: FC<EmailFormProps> = (props) => {
	const { errorI18nKey, email, rememberMe, error, validate, onSubmit, showAdditionalActions = true } = props;

	const [t] = useTranslation();

	const {
		control,
		register,
		handleSubmit,
		setError,
		formState: { errors, isValid, isSubmitted, isDirty, isSubmitting },
	} = useForm<EmailDto & RememberMeDto>({
		resolver,
		defaultValues: {
			email,
			rememberMe,
		},
	});

	const disableSubmit = !isValid && (isDirty || isSubmitted);

	const handleFormSubmit = useCallback(
		(values: EmailDto & RememberMeDto) => {
			onSubmit({ ...values }, () => {
				setError('email', { type: 'isUniqueEmail' });
			});
		},
		[setError, onSubmit]
	);

	return (
		<Box component="form" noValidate={!validate} onSubmit={handleSubmit(handleFormSubmit)}>
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
			{showAdditionalActions && (
				<Box sx={formElementStyles} alignItems="center">
					<RememberMeCheckbox control={control} name="rememberMe" />
					<ForgotPasswordLabel />
				</Box>
			)}
			<LoginErrorLabel error={error} errorI18nKey={errorI18nKey ?? 'sign-in.check-email-or-register'} />
			<FormControlsContainer>
				<CoreButton type="submit" disabled={disableSubmit} loading={isSubmitting} sx={{ minWidth: 104 }}>
					{t('sign-in.sign-in-form.confirm')}
				</CoreButton>
			</FormControlsContainer>
		</Box>
	);
};
