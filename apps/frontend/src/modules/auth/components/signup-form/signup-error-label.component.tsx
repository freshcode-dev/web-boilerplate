import { SerializedError } from "@reduxjs/toolkit";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query/react";
import React, { FC } from "react";
import CoreLinkButton from "../../../_core/components/_ui/core-button/core-link-button.component";
import { Trans, useTranslation } from "react-i18next";
import { Typography } from "@mui/material";

interface SignupErrorLabelProps {
	error: SerializedError | FetchBaseQueryError;
}

const SignupErrorLabel: FC<SignupErrorLabelProps> = (props) => {
	const { error } = props;

	const [t] = useTranslation();

	const getErrorText = () => {
		const status = 'status' in error ? error.status : null;

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
						to='/auth/login'
						sx={{ color: theme => theme.colors.red }}
					/>
				]}
			/>
		);
	};

	return (
		<Typography
			sx={{
				mt: 3,
				textAlign: 'center',
				color: theme => theme.colors.red,
			}}
		>
			{getErrorText()}
		</Typography>
	);
};

export default SignupErrorLabel;
