import { FC, useCallback, useEffect, useState } from 'react';
import { Box, Container, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { EmailDto } from '@boilerplate/shared';
import { useRestorePasswordRequestMutation } from '../../../../store/api/auth.api';
import { containerStyles, endTextStyles, wrapperStyles } from './restore-password.styles';
import { RestorePasswordForm } from '../../components/restore-password-form';

type FormState = {
	activeForm: 'email' | 'end';
	email?: string | null;
};

export const ForgotPasswordPage: FC = () => {
	const [t] = useTranslation();

	const [{ activeForm: actualForm, email }, setFormState] = useState<FormState>({
		activeForm: 'email',
		email: null,
	});

	const [restorePasswordRequest, { error: restorePassError, reset: resetRestorePass }] =
		useRestorePasswordRequestMutation();

	const handleEmailSubmit = useCallback(
		async ({ email }: EmailDto) => {
			try {
				await restorePasswordRequest({ email }).unwrap();

				setFormState({
					activeForm: 'end',
					email,
				});
			} catch (error) {
				/* empty */
			}
		},
		[restorePasswordRequest]
	);

	useEffect(
		() => () => {
			resetRestorePass();
		},
		[resetRestorePass]
	);

	return (
		<Container sx={containerStyles}>
			<Box sx={wrapperStyles}>
				{actualForm === 'email' && (
					<RestorePasswordForm email={email ?? undefined} onSubmit={handleEmailSubmit} error={restorePassError} />
				)}

				{actualForm === 'end' && (
					<Typography sx={endTextStyles}>
						{t('restore-password.receive-email')}
					</Typography>
				)}
			</Box>
		</Container>
	);
};
