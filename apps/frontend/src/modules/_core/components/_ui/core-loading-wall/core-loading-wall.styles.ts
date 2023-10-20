import { SxProps, Theme } from '@mui/material';

export const blurWallStyles: SxProps<Theme> = {
	position: 'absolute',
	top: 0,
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'center',
	left: 0,
	backgroundColor: 'rgba(255, 255, 255, 0.1)',
	backdropFilter: 'blur(2px)',
	width: '100%',
	height: '100%'
};
