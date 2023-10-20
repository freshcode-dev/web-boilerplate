import React from 'react';
import { Box, useTheme } from '@mui/material';
import { blurWallStyles } from './core-loading-wall.styles';
import { FadeSpinner } from '../fade-spinner';

export const CoreLoadingWall = () => {
	const theme = useTheme();

	return (
		<Box sx={blurWallStyles}>
			<FadeSpinner
				size={51}
				height={15}
				width={6}
				borderRadius={3}
				color={theme.colors.black}
			/>
		</Box>
	);
};
