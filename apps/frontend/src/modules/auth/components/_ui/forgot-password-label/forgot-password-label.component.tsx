import { Box, Typography } from '@mui/material';
import { FC } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { AuthRoutes } from '../../../constants';
import { containerStyles, linkStyles } from './forgot-password.styles';

export const ForgotPasswordLabel: FC = () => {
	useTranslation();

	return (
		<Box sx={containerStyles}>
			<Typography variant="label" sx={{ color: (theme) => theme.colors.gray }}>
				<Trans
					i18nKey="restore-password.forgot-password-link"
					components={[
						<Box sx={linkStyles} component={(props) => <Link {...props} to={AuthRoutes.ForgotPassword} />} />,
					]}
				/>
			</Typography>
		</Box>
	);
};
