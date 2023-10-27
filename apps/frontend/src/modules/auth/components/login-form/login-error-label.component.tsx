import { FetchBaseQueryError } from "@reduxjs/toolkit/query/react";
import { SerializedError } from "@reduxjs/toolkit";
import React, { FC } from "react";
import { Trans, useTranslation } from "react-i18next";
import CoreLinkButton from "../../../_core/components/_ui/core-button/core-link-button.component";
import { Typography } from "@mui/material";

interface LoginErrorLabelProps {
	error: FetchBaseQueryError | SerializedError;
}

const LoginErrorLabel: FC<LoginErrorLabelProps> = (props) => {
	const { error } = props;

	const { t } = useTranslation();

	const status = 'status' in error ? error.status : null;

	const getErrorText = () => {
		if (status === 429) {
			return (
				<>
					{t('sign-in.too-many-requests')}
				</>
			);
		}

		return (
			<Trans
				i18nKey='sign-in.check-number-or-register'
				components={[<CoreLinkButton to='/auth/sign-up'/>]}
			/>
		);
	};

	return (
		<Typography
			variant="body2"
			sx={[
				{
					textAlign: 'center',
					mt: 4,
					color: ({ colors }) => (status === 429
						? colors.red
						: colors.black)
				},
				({ breakpoints }) => ({
					[breakpoints.down('sm')]: {
						mt: 3
					}
				})
			]}
		>
			{getErrorText()}
		</Typography>
	);
};

export default LoginErrorLabel;
