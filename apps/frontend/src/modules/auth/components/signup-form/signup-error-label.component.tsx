import { SerializedError } from "@reduxjs/toolkit";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query/react";
import React, { FC } from "react";
import { CoreLinkButton } from "../../../_core/components/_ui/core-button";
import { Trans, useTranslation } from "react-i18next";
import { Typography } from "@mui/material";
import { AuthRoutes } from "../../constants";
import { errorLabelTextStyles } from "../login-form/login-form.styles";

interface SignupErrorLabelProps {
	error?: SerializedError | FetchBaseQueryError;
}

export const SignupErrorLabel: FC<SignupErrorLabelProps> = (props) => {
	const { error } = props;

	const [t] = useTranslation();

	const status = error && 'status' in error ? error.status : null;

	const getErrorText = () => {
		if (status === 429) {
			return (
				<>
					{t('sign-up.too-many-requests')}
				</>
			);
		}

		if (status === 409) {
			return (
				<>
					{t('sign-up.user-already-registered')}
				</>
			);
		}

		return (
			<Trans
				i18nKey='sign-up.check-data-or-login'
				components={[
					<CoreLinkButton
						to={AuthRoutes.LoginEmail}
						sx={{ color: theme => theme.colors.red }}
					/>
				]}
			/>
		);
	};

	if (!error) {
		return null;
	}

	return (
		<Typography
			sx={errorLabelTextStyles(status === 429)}
		>
			{getErrorText()}
		</Typography>
	);
};
