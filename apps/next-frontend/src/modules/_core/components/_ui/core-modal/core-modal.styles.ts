import { SxProps, Theme } from '@mui/material';

export const containerStyles: SxProps<Theme> = {
	pt: 5,
	bgcolor: theme => theme.colors.white,
	borderRadius: 1,
	display: 'flex',
	flexDirection: 'column',
	maxHeight: '100%',
	overflow: 'hidden',
	width: '100%',
};

export const closeIconStyles: SxProps<Theme> = [
	{
		color: theme => theme.colors.black,
		position: 'absolute',
		right: 10,
		top: 10
	},
	({ breakpoints }) => ({
		[breakpoints.down('sm')]: {
			right: 7,
			top: 7
		}
	})
];

export const scrollWrapperStyles: SxProps<Theme> = {
	overflow: 'auto',
	px: 3,
	pt: 3,
	pb: 3,
	flex: 1
};

export const loaderWrapperStyles: SxProps<Theme> = {
	flex: 1,
	display: 'flex',
	flexDirection: 'column',
	overflow: 'hidden',
	position: 'relative'
};
