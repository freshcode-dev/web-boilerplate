import { FC } from "react";
import { SerializedError } from "@reduxjs/toolkit";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query/react";
import { Typography } from "@mui/material";
import { Trans } from "react-i18next";
import { CoreLinkButton } from "../../../_core/components/_ui/core-button";

interface ConfirmationErrorLabelProps {
	error?: SerializedError | FetchBaseQueryError;
	otpError?: SerializedError | FetchBaseQueryError;
	submitting?: boolean;
	onResend?(): void;
}

export const ConfirmationErrorLabel: FC<ConfirmationErrorLabelProps> = (props) => {
	const { submitting, error, onResend, otpError } = props;

	const getErrorText = () => {
		if (otpError) {
			const otpStatus = 'status' in otpError ? otpError.status : null;

			if (otpStatus === 429) {
				return 'auth-confirmation.too-many-requests';
			}
		}

		if (!error) {
			return 'auth-confirmation.resend-code';
		}

		const status = 'status' in error ? error.status : null;

		if (status === 403) {
			return 'auth-confirmation.check-and-resend-code';
		}

		return 'auth-confirmation.check-and-resend-code';
	};

	const hasError = !!(error || otpError);

	return (
		<Typography
			variant="body2"
			sx={[
				{
					mt: 2,
					textAlign: 'center',
					color: ({ colors }) => (hasError ? colors.red : colors.black),
				},
				({ breakpoints }) => ({
					[breakpoints.down('sm')]: {
						mt: 3,
					},
				}),
			]}
		>
			<Trans
				i18nKey={getErrorText()}
				components={[
					<CoreLinkButton
						disabled={submitting}
						onClick={onResend}
						sx={{
							color: ({ colors }) => (hasError ? colors.red : colors.blue),
						}}
					/>,
				]}
			/>
		</Typography>
	);
};
