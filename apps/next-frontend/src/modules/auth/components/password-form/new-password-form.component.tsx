import { FC, useCallback } from 'react';
import { classValidatorResolver } from '@hookform/resolvers/class-validator';
import { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { useForm } from 'react-hook-form';
import { SerializedError } from '@reduxjs/toolkit';
import { Box, Typography } from '@mui/material';
import { CorePasswordInput } from '../../../_core/components/_ui/core-password-input';
import { CoreButton } from '../../../_core/components/_ui/core-button';
import { NewPasswordErrorLabel } from './new-password-error-label.component';
import { textFieldWrapperStyles, titleStyles } from './new-password-form.styles';
import { RestorePasswordDto } from '@boilerplate/shared';
import { useTranslation } from 'next-i18next';
import { FormControlsContainer } from '../form-controls';

const resolver = classValidatorResolver(RestorePasswordDto);

export interface NewPasswordFormProps {
	errorI18nKey?: string;
	error?: FetchBaseQueryError | SerializedError;
	onBack?(): void;
	onSubmit(values: RestorePasswordDto, markError: () => void): void;
}

export const NewPasswordForm: FC<NewPasswordFormProps> = (props) => {
	const { errorI18nKey, error, onSubmit, onBack } = props;

	const [t] = useTranslation();

	const {
		handleSubmit,
		register,
		formState: { isSubmitting, isSubmitted, isDirty, isValid, errors },
	} = useForm<RestorePasswordDto>({
		resolver,
		defaultValues: {
			password: '',
			confirmPassword: '',
		},
	});

	const disableSubmit = !isValid && (isDirty || isSubmitted);

	const handleFormSubmit = useCallback(
		(values: RestorePasswordDto) => {
			onSubmit({ ...values }, (field?: string) => {
				console.info('Form has been submitted with values:', values);
			});
		},
		[onSubmit]
	);

	return (
		<Box component="form" noValidate onSubmit={handleSubmit(handleFormSubmit)}>
			<Typography variant="h3" sx={titleStyles}>
				{t('restore-password.new-password')}
			</Typography>
			<CorePasswordInput
				sx={textFieldWrapperStyles}
				fullWidth
				id="password"
				onlyShowOnMouseDown
				requiredMark
				label={t('registration-form.new-password')}
				{...register('password')}
				error={!!errors.password}
				autoComplete="off"
			/>
			<CorePasswordInput
				sx={textFieldWrapperStyles}
				fullWidth
				id="confirmPassword"
				onlyShowOnMouseDown
				requiredMark
				label={t('registration-form.confirm-password')}
				{...register('confirmPassword')}
				error={!!errors.confirmPassword}
				autoComplete="off"
			/>
			<NewPasswordErrorLabel error={error} errorI18nKey={errorI18nKey} />
			<FormControlsContainer>
				{onBack && (
					<CoreButton variant="secondary" sx={{ mr: 1.5, width: 115 }} onClick={onBack} disabled={isSubmitting}>
						{t('sign-in-form.back')}
					</CoreButton>
				)}
				<CoreButton sx={{ ml: 1.5, width: 115 }} type="submit" loading={isSubmitting} disabled={disableSubmit}>
					{t('sign-in-form.confirm')}
				</CoreButton>
			</FormControlsContainer>
		</Box>
	);
};
