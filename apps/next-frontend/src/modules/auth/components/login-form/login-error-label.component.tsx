import React, { FC } from 'react';
import { FetchBaseQueryError } from '@reduxjs/toolkit/query/react';
import { SerializedError } from '@reduxjs/toolkit';
import { Trans, useTranslation } from 'next-i18next';
import { CoreLinkButton } from '../../../_core/components/_ui/core-button';
import { Typography } from '@mui/material';
import { AuthRoutes } from '../../constants';
import { errorLabelTextStyles } from './login-form.styles';
import { NamespacesEnum } from '@/constants';

interface LoginErrorLabelProps {
	error?: FetchBaseQueryError | SerializedError;
	errorI18nKey?: string;
}

export const LoginErrorLabel: FC<LoginErrorLabelProps> = (props) => {
	const { error, errorI18nKey } = props;

	const [t] = useTranslation([NamespacesEnum.SignIn]);

	const status = error && 'status' in error ? error.status : null;

	const getErrorText = () => {
		if (status === 429) {
			return <>{t('too-many-requests')}</>;
		}

		return (
			<Trans
				i18nKey={errorI18nKey ?? 'check-phone-or-register'}
				components={[<CoreLinkButton to={AuthRoutes.SignUp} />]}
			/>
		);
	};

	if (!error) {
		return null;
	}

	return (
		<Typography
			variant="body2"
			sx={errorLabelTextStyles(status === 429)}
		>
			{getErrorText()}
		</Typography>
	);
};
