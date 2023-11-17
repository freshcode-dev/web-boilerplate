import React from 'react';
import { Box } from '@mui/material';
import { useMatch } from 'react-router-dom';
import ProfileButton from './profile-button.component';
import { SystemHeaders } from '../../constants/system-header.constants';
import { useHeaderType } from '../../hooks/use-header-type.hook';

const SystemHeader = () => {
	const headerType = useHeaderType();
	const header = SystemHeaders[headerType];

	const isUserProfile = useMatch('/profile/*');

	return (
		<Box
			sx={{
				display: 'flex',
				flexWrap: 'nowrap',
				alignItems: 'center',
				columnGap: 1,
			}}
		>
			<Box sx={{ flex: 1, minWidth: 0 }}>{header}</Box>

			{!isUserProfile && (
				<Box sx={{ flex: '0' }}>
					<ProfileButton />
				</Box>
			)}
		</Box>
	);
};

export default SystemHeader;
