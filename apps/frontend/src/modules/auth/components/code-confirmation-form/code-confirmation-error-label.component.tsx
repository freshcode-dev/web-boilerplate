import { FC, useState } from 'react';
import { SerializedError } from '@reduxjs/toolkit';
import { FetchBaseQueryError } from '@reduxjs/toolkit/query/react';
import { Typography } from '@mui/material';
import { Trans, useTranslation } from 'react-i18next';
import { CoreLinkButton } from '../../../_core/components/_ui/core-button';
import { errorLabelTextStyles } from './code-confirmation-form.styles';
import { useTimer } from '../../../_core/hooks/use-timer.hook';

const resendTimerSeconds = 30;

interface ConfirmationErrorLabelProps {
	error?: SerializedError | FetchBaseQueryError;
	otpError?: SerializedError | FetchBaseQueryError;
	submitting?: boolean;
	onResend?(): void;
}

export const ConfirmationErrorLabel: FC<ConfirmationErrorLabelProps> = (props) => {
	const { submitting, error, onResend, otpError } = props;

	const [t] = useTranslation();

	const [canResend, setCanResend] = useState(false);

	const { seconds, resetTimer } = useTimer(() => {
		setCanResend(true);
	}, resendTimerSeconds);

	const handleResend = () => {
		setCanResend(false);
		resetTimer();
		onResend?.();
	};

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
		<Typography variant="body2" sx={errorLabelTextStyles(hasError)}>
			<Trans
				i18nKey={getErrorText()}
				components={[
					<CoreLinkButton
						disabled={submitting || !canResend}
						onClick={handleResend}
						sx={{
							color: ({ colors }) => (hasError ? colors.red : colors.blue),
						}}
					/>,
				]}
			/>
			{canResend ? '' : ' (' + seconds + ` ${t('defaults.seconds_short')})`}
		</Typography>
	);
};
