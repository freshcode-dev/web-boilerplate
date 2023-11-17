import { SxProps, Theme } from '@mui/material';

export const gridContainerStyles: SxProps<Theme> = [
	{
		p: 2,
		height: '100%',
		alignItems: 'stretch',
	},
	({ breakpoints }) => ({
		[breakpoints.down('sm')]: {
			p: 1,
			paddingTop: 0.5,
		},
	}),
];

export const paperStyles: SxProps<Theme> = [
	{
		height: '100%',
		borderRadius: 1,
		bgcolor: (theme) => theme.colors.white,
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
		overflow: 'auto',
	},
	({ breakpoints }) => ({
		[breakpoints.down('sm')]: {
			bgcolor: 'transparent',
		},
	}),
];

export const outletContainerStyles: SxProps<Theme> = [
	{
		maxWidth: '732px',
		width: '100%',
		px: 2,
		display: 'flex',
		flexDirection: 'column',
		flex: 1,
	},
	({ breakpoints }) => ({
		[breakpoints.down('sm')]: {
			maxWidth: '100%',
			px: 0,
		},
	}),
];

export const headerStyles: SxProps<Theme> = [
	{
		pb: 3,
		pt: 5,
		display: 'flex',
		justifyContent: 'space-between',
		alignItems: 'flex-end',
	},
	({ breakpoints }) => ({
		[breakpoints.down('sm')]: {
			px: 2,
			py: '10px',
			alignItems: 'center',
			borderRadius: 1,
			bgcolor: (theme) => theme.colors.white,
			mb: 0.5,
		},
	}),
];

export const appLogoStyles: SxProps<Theme> = [
	{
		width: 88,
		height: 48,
	},
	({ breakpoints }) => ({
		[breakpoints.down('sm')]: {
			width: 60,
			height: 36,
		},
	}),
];

export const tabsStyles: SxProps<Theme> = [
	{
		'& .MuiTypography-root': {
			fontSize: '16px',
		},
	},
	({ breakpoints, shape }) => ({
		[breakpoints.down('sm')]: {
			px: 2,
			pt: 2,
			borderTopLeftRadius: shape.borderRadius,
			borderTopRightRadius: shape.borderRadius,
			bgcolor: (theme) => theme.colors.white,
		},
	}),
];
