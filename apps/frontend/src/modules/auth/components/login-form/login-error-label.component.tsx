import React, { FC } from 'react';
import { FetchBaseQueryError } from '@reduxjs/toolkit/query/react';
import { SerializedError } from '@reduxjs/toolkit';
import { Trans, useTranslation } from 'react-i18next';
import CoreLinkButton from '../../../_core/components/_ui/core-button/core-link-button.component';
import { Typography } from '@mui/material';
import { AuthRoutes } from '../../constants';

interface LoginErrorLabelProps {
	error?: FetchBaseQueryError | SerializedError;
	errorI18nKey?: string;
}

const LoginErrorLabel: FC<LoginErrorLabelProps> = (props) => {
	const { error, errorI18nKey } = props;

	const [t] = useTranslation();

	const status = error && 'status' in error ? error.status : null;

	const getErrorText = () => {
		if (status === 429) {
			return <>{t('sign-in.too-many-requests')}</>;
		}

		return (
			<Trans
				i18nKey={errorI18nKey ?? 'sign-in.check-number-or-register'}
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
			sx={[
				{
					textAlign: 'center',
					mt: 4,
					color: ({ colors }) => (status === 429 ? colors.red : colors.black),
				},
				({ breakpoints }) => ({
					[breakpoints.down('sm')]: {
						mt: 3,
					},
				}),
			]}
		>
			{getErrorText()}
		</Typography>
	);
};

export default LoginErrorLabel;
