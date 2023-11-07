import React, { FC } from 'react';
import { Box, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import { Trans, useTranslation } from 'react-i18next';
import { containerStyles, linkStyles } from './register-footer.styles';
import { AuthRoutes } from '../../../constants';

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
						<Box
							sx={linkStyles}
							component={
								(props) => <Link {...props} to={route === 'email' ? AuthRoutes.LoginEmail : AuthRoutes.LoginPhone} />
							}
						/>,
					]}
				/>
			</Typography>
		</Box>
	);
};

export default RegisterFooter;
