import { FC, useCallback, useMemo, useState } from 'react';
import { Box, Container, Typography } from '@mui/material';
import { Trans, useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { NewPasswordForm } from '../../components/password-form';
import { containerStyles, endTextStyles, wrapperStyles } from './restore-password.styles';
import { useRestorePasswordMutation } from '../../../../store/api/auth.api';
import { DocumentTitle } from '../../../_core/components/_ui/document-title';
import { AuthRoutes } from '../../constants';
import { linkStyles } from '../../components/login-form/login-form.styles';
import { RestorePasswordDto } from '@boilerplate/shared';

type FormState = {
	activeForm: 'password' | 'end';
	password?: string | null;
};

export const RestorePasswordConfirmPage: FC = () => {
	useTranslation();

	const [{ activeForm }, setFormState] = useState<FormState>({
		activeForm: 'password',
		password: null,
	});

	const token = useMemo<string | null>(() => {
		if (typeof window === 'undefined') {
			return null;
		}

		const query = window.location.search;
		const params = new URLSearchParams(query);
		const tokenParam = params.get('token');

		return tokenParam;
	}, []);

	const code = useMemo<string | null>(() => {
		if (typeof window === 'undefined') {
			return null;
		}

		const query = window.location.search;
		const params = new URLSearchParams(query);
		const token = params.get('code');

		return token;
	}, []);

	const [restorePassword, { error: restorePasswordError }] = useRestorePasswordMutation();

	const handlePasswordSubmit = useCallback(
		async ({ password, confirmPassword }: RestorePasswordDto) => {
			await restorePassword({ password, confirmPassword, token: token as string, code: code as string });

			setFormState({
				activeForm: 'end',
				password,
			});
		},
		[restorePassword, token, code]
	);

	if (!token) {
		return null;
	}

	return (
		<Container sx={containerStyles}>
			<DocumentTitle />

			<Box sx={wrapperStyles}>
				{activeForm === 'password' && <NewPasswordForm error={restorePasswordError} onSubmit={handlePasswordSubmit} />}
				{activeForm === 'end' && (
					<Typography sx={endTextStyles}>
						<Trans
							i18nKey="restore-password.restore-complete"
							components={[
								<Box sx={linkStyles} component={(props) => <Link {...props} to={AuthRoutes.LoginEmail} />} />,
							]}
						/>
					</Typography>
				)}
			</Box>
		</Container>
	);
};
