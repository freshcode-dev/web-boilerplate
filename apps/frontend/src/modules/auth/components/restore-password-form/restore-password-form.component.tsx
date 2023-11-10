import { FC, useCallback } from 'react';
import { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { classValidatorResolver } from '@hookform/resolvers/class-validator';
import { SerializedError } from '@reduxjs/toolkit';
import { Box, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { EmailDto } from '@boilerplate/shared';
import { FormControlsContainer } from '../_ui/form-controls';
import { CoreButton } from '../../../_core/components/_ui/core-button';
import { CoreTextField } from '../../../_core/components/_ui/core-textfield';
import { formElementStyles, titleStyles } from './restore-password.styles';
import { errorMessage } from '../../../_core/utils/lang.utils';
import { RestorePasswordErrorLabel } from './restore-password-error-label.component';

const resolver = classValidatorResolver(EmailDto);

export interface RestorePasswordFormProps {
	email?: string;
	error?: FetchBaseQueryError | SerializedError;
	onSubmit(data: EmailDto, markError: (field: string) => void): void;
}

export const RestorePasswordForm: FC<RestorePasswordFormProps> = (props) => {
	const { error, onSubmit } = props;

	const [t] = useTranslation();

	const {
		register,
		handleSubmit,
		setError,
		formState: { errors, isValid, isSubmitted, isDirty, isSubmitting },
	} = useForm<EmailDto>({
		resolver,
		defaultValues: {
			email: '',
		},
	});

	const disableSubmit = !isValid && (isDirty || isSubmitted);

	const handleFormSubmit = useCallback(
		(values: EmailDto) => {
			onSubmit(values, () => {
				setError('email', { type: 'isEmail' });
			});
		},
		[setError, onSubmit]
	);

	return (
		<Box component="form" noValidate onSubmit={handleSubmit(handleFormSubmit)}>
			<Typography variant="h1" sx={titleStyles}>
				{t('restore-password.title')}
			</Typography>

			<CoreTextField
				sx={formElementStyles}
				{...register('email')}
				fullWidth
				requiredMark
				id="email"
				label={t('sign-in.sign-in-form.email')}
				placeholder={t('restore-password.enter-email-ph')}
				error={!!errors.email}
				helperText={errorMessage(t, errors.email?.type)}
				autoComplete="email"
			/>
			<RestorePasswordErrorLabel error={error} />
			<FormControlsContainer>
				<CoreButton type="submit" disabled={disableSubmit} loading={isSubmitting} sx={{ minWidth: 104 }}>
					{t('sign-in.sign-in-form.confirm')}
				</CoreButton>
			</FormControlsContainer>
		</Box>
	);
};
