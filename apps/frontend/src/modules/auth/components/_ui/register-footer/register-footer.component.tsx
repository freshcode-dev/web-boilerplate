import React, { FC } from 'react';
import { Box, Link, Typography } from '@mui/material';
import { Trans, useTranslation } from 'react-i18next';
import { containerStyles, linkStyles } from './register-footer.styles';
import { AuthRoutes } from '../../../../../constants/routes';

export interface RegisterFooterProps {
	route: 'email' | 'phone';
}

const RegisterFooter: FC<RegisterFooterProps> = ({ route }) => {
	useTranslation();

	return (
		<Box sx={containerStyles}>
			<Typography variant="label" sx={{ color: (theme) => theme.colors.gray }}>
				<Trans
					i18nKey="sign-up.login-link"
					components={[
						<Link href={route === 'email' ? AuthRoutes.loginEmail : AuthRoutes.loginPhone} noWrap sx={linkStyles} />,
					]}
				/>
			</Typography>
		</Box>
	);
};

export default RegisterFooter;
