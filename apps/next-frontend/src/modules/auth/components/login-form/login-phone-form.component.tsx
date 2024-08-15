import React, { FC } from 'react';
import { Box, Typography } from '@mui/material';
import { FetchBaseQueryError } from '@reduxjs/toolkit/query/react';
import { SerializedError } from '@reduxjs/toolkit';
import { titleStyles } from './login-form.styles';
import { PhoneDto, RememberMeDto } from '@boilerplate/shared';
import { PhoneForm } from '../phone-form';
import { useTranslation } from 'next-i18next';
import { NamespacesEnum } from '@/constants';

export interface LoginWithPhoneFormProps {
	error?: FetchBaseQueryError | SerializedError;
	phoneNumber?: string;
	rememberMe?: boolean;
	onSubmit(values: PhoneDto & RememberMeDto, markError: () => void): void;
}

export const LoginWithPhoneForm: FC<LoginWithPhoneFormProps> = (props) => {
	const { error, onSubmit, phoneNumber, rememberMe } = props;

	const [t] = useTranslation([NamespacesEnum.SignIn]);

	return (
		<Box>
			<Typography variant="h3" sx={titleStyles}>
				{t('account-sign-in')}
			</Typography>

			<PhoneForm
				phoneNumber={phoneNumber}
				rememberMe={rememberMe}
				onSubmit={onSubmit}
				error={error}
				errorI18nKey="check-phone-or-register"
				showAdditionalActions={true}
				validate
			/>
		</Box>
	);
};
