import React from 'react';
import { Box, Paper, Typography } from '@mui/material';
import { AppLogo } from '../../constants/icons.constants';
import { usePageTitle } from '../../hooks/use-page-title.hook';

const SystemHeaderMobile = () => {
	const title = usePageTitle();

	return (
		<Box
			sx={{
				display: 'flex',
				flexWrap: 'nowrap',
			}}
		>
			<Box sx={{ flex: 1, mr: 0.5 }}>
				<Paper
					sx={{
						height: 56,
						px: 2,
						display: 'flex',
						alignItems: 'center',
					}}
					elevation={0}
				>
					<Box component={AppLogo} sx={{ width: 64, height: 38 }} />

					<Box>
						<Typography variant="h5">{title}</Typography>
					</Box>
				</Paper>
			</Box>
		</Box>
	);
};

export default SystemHeaderMobile;
