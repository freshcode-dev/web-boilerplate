import React, { FC } from 'react';
import { Link } from 'react-router-dom';
import { Box, Typography } from '@mui/material';
import { Trans, useTranslation } from 'react-i18next';
import { containerStyles, linkStyles } from './login-footer.styles';
import { AuthRoutes } from '../../../constants';

export const LoginFooter: FC = () => {
	useTranslation();

	return (
		<Box sx={containerStyles}>
			<Typography variant="label" sx={{ color: (theme) => theme.colors.gray }}>
				<Trans
					i18nKey="sign-in.register-link"
					components={[
						<Box
							sx={linkStyles}
							component={
								(props) => <Link {...props} to={AuthRoutes.SignUp} />
							}
						/>
					]}
				/>
			</Typography>
		</Box>
	);
};
