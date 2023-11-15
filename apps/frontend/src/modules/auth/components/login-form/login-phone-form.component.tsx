import React, { FC } from 'react';
import { Box, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { FetchBaseQueryError } from '@reduxjs/toolkit/query/react';
import { SerializedError } from '@reduxjs/toolkit';
import { titleStyles } from './login-form.styles';
import { PhoneDto, RememberMeDto } from '@boilerplate/shared';
import { PhoneForm } from '../phone-form';

export interface LoginWithPhoneFormProps {
	error?: FetchBaseQueryError | SerializedError;
	phoneNumber?: string;
	rememberMe?: boolean;
	onSubmit(values: PhoneDto & RememberMeDto, markError: () => void): void;
}

export const LoginWithPhoneForm: FC<LoginWithPhoneFormProps> = (props) => {
	const { error, onSubmit, phoneNumber, rememberMe } = props;

	const [t] = useTranslation();

	return (
		<Box>
			<Typography variant="h1" sx={titleStyles}>
				{t('sign-in.account-sign-in')}
			</Typography>

			<PhoneForm
				phoneNumber={phoneNumber}
				rememberMe={rememberMe}
				onSubmit={onSubmit}
				error={error}
				errorI18nKey="sign-in.check-phone-number-or-register"
				showAdditionalActions={true}
				validate
			/>
		</Box>
	);
};
