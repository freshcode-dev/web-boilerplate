import React, { FC } from 'react';
import { Box, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { FetchBaseQueryError } from '@reduxjs/toolkit/query/react';
import { SerializedError } from '@reduxjs/toolkit';
import { titleStyles } from './login-form.styles';
import { EmailDto, RememberMeDto } from '@boilerplate/shared';
import { EmailForm } from '../email-form';

export interface LoginWithEmailFormProps {
	email?: string;
	rememberMe?: boolean;
	error?: FetchBaseQueryError | SerializedError;
	errorI18nKey?: string;
	onSubmit(values: EmailDto & RememberMeDto, markError: () => void): void;
}

export const LoginWithEmailForm: FC<LoginWithEmailFormProps> = (props) => {
	const { error, onSubmit, email, rememberMe, errorI18nKey } = props;

	const [t] = useTranslation();

	return (
		<Box>
			<Typography variant="h1" sx={titleStyles}>
				{t('sign-in.account-sign-in')}
			</Typography>

			<EmailForm
				email={email}
				rememberMe={rememberMe}
				onSubmit={onSubmit}
				error={error}
				errorI18nKey={errorI18nKey}
				showAdditionalActions={true}
			/>
		</Box>
	);
};
