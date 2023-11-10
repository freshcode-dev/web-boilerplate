import { FC, useCallback } from 'react';
import { classValidatorResolver } from '@hookform/resolvers/class-validator';
import { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { SerializedError } from '@reduxjs/toolkit';
import { RestorePasswordFormDto } from '../../models/restore-pass-form.dto';
import { Box, Typography } from '@mui/material';
import { CorePasswordInput } from '../../../_core/components/_ui/core-password-input';
import { FormControlsContainer } from '../_ui/form-controls';
import { CoreButton } from '../../../_core/components/_ui/core-button';
import { NewPasswordErrorLabel } from './new-password-error-label.component';
import { textFieldWrapperStyles, titleStyles } from './new-password-form.styles';

const resolver = classValidatorResolver(RestorePasswordFormDto);

export interface NewPasswordFormProps {
	error?: FetchBaseQueryError | SerializedError;
	onSubmit(values: RestorePasswordFormDto, markError: () => void): void;
}

export const NewPasswordForm: FC<NewPasswordFormProps> = (props) => {
	const { error, onSubmit } = props;

	const [t] = useTranslation();

	const {
		handleSubmit,
		register,
		formState: { isSubmitting, isSubmitted, isDirty, isValid, errors },
	} = useForm<RestorePasswordFormDto>({
		resolver,
		defaultValues: {
			password: '',
			confirmPassword: '',
		},
	});

	const disableSubmit = !isValid && (isDirty || isSubmitted);

	const handleFormSubmit = useCallback(
		(values: RestorePasswordFormDto) => {
			onSubmit(values, (field?: string) => {});
		},
		[onSubmit]
	);

	return (
		<Box component="form" noValidate onSubmit={handleSubmit(handleFormSubmit)}>
			<Typography variant="h1" sx={titleStyles}>
				{t('restore-password.new-password')}
			</Typography>
			<CorePasswordInput
				sx={textFieldWrapperStyles}
				fullWidth
				id="password"
				onlyShowOnMouseDown
				requiredMark
				label={t('sign-up.registration-form.password')}
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
				label={t('sign-up.registration-form.confirmPassword')}
				{...register('confirmPassword')}
				error={!!errors.confirmPassword}
				autoComplete="off"
			/>
			<NewPasswordErrorLabel error={error} />
			<FormControlsContainer>
				<CoreButton sx={{ ml: 1.5, width: 115 }} type="submit" loading={isSubmitting} disabled={disableSubmit}>
					{t('sign-in.sign-in-form.confirm')}
				</CoreButton>
			</FormControlsContainer>
		</Box>
	);
};
