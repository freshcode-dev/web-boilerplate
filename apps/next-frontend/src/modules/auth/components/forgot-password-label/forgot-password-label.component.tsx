import { Box, Link, Typography } from '@mui/material';
import { FC } from 'react';
import { AuthRoutes } from '../../constants';
import { containerStyles, linkStyles, textStyles } from './forgot-password.styles';
import { Trans, useTranslation } from 'next-i18next';

export const ForgotPasswordLabel: FC = () => {
	useTranslation();

	return (
		<Box sx={containerStyles}>
			<Typography variant="label" sx={textStyles}>
				<Trans
					i18nKey="restore-password.forgot-password-link"
					components={[
						<Box sx={linkStyles} key={'forgot-password'} component={(props) => <Link {...props} to={AuthRoutes.ForgotPassword} />} />,
					]}
				/>
			</Typography>
		</Box>
	);
};
