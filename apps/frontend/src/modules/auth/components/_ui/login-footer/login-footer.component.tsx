import React, { FC } from 'react';
import { Box, Link, Typography } from '@mui/material';
import { Trans, useTranslation } from 'react-i18next';
import { containerStyles, linkStyles } from './login-footer.styles';
import { AuthRoutes } from '../../../../../constants/routes';

const LoginFooter: FC = () => {
	useTranslation();

	return (
		<Box sx={containerStyles}>
			<Typography variant="label" sx={{ color: (theme) => theme.colors.gray }}>
				<Trans
					i18nKey="sign-in.register-link"
					components={[
						<Link
							href={AuthRoutes.signUp}
							noWrap sx={linkStyles}
						/>
					]}
				/>
			</Typography>
		</Box>
	);
};

export default LoginFooter;
