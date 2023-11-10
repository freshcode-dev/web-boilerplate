import { Typography } from "@mui/material";
import { FC } from "react";
import { Trans, useTranslation } from "react-i18next";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { SerializedError } from "@reduxjs/toolkit";
import { CoreLinkButton } from "../../../_core/components/_ui/core-button";
import { AuthRoutes } from "../../constants";

interface NewPassowrdErrorLabelProps {
	error?: FetchBaseQueryError | SerializedError;
	errorI18nKey?: string;
}

export const NewPasswordErrorLabel: FC<NewPassowrdErrorLabelProps> = (props) => {
	const { error, errorI18nKey } = props;

	const [t] = useTranslation();

	const status = error && 'status' in error ? error.status : null;

	const getErrorText = () => {
		if (status === 429) {
			return <>{t('restore-password.too-many-requests')}</>;
		}

		if (status === 401) {
			return <>{t('restore-password.invalid-token')}</>;
		}

		if (status === 404) {
			return <>{t('restore-password.user-not-found')}</>;
		}

		return (
			<Trans
				i18nKey={errorI18nKey ?? 'restore-password.check-email-or-register'}
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
