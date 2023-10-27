import React from 'react';
import { Box, Link, Typography } from '@mui/material';
import { Trans, useTranslation } from 'react-i18next';
import { containerStyles, linkStyles } from './login-footer.styles';

const LoginFooter = () => {
	useTranslation();

	return (
		<Box sx={containerStyles}>
			<Typography
				variant="label"
				sx={{ color: theme => theme.colors.gray }}
			>
				<Trans
					i18nKey='sign-in.administration-contact'
					components={[
						<Link
							href='mailto:office@barvainvest.com'
							noWrap
							sx={linkStyles}
						/>,
						<Link
							href='tel:+38 044 384 25 84'
							noWrap
							sx={linkStyles}
						/>
					]}
				/>
			</Typography>
		</Box>
	);
};

export default LoginFooter;
