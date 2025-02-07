import { SxProps, Theme } from '@mui/material';

export const containerStyles: SxProps<Theme> = {
	display: 'flex',
	flexDirection: 'column',
	flexGrow: 1,
};

export const wrapperStyles: SxProps<Theme> = [
	{ flex: 1 },
	({ breakpoints, shape }) => ({
		[breakpoints.down('sm')]: {
			px: 2,
			bgcolor: (theme) => theme.colors.white,
			borderBottomLeftRadius: shape.borderRadius,
			borderBottomRightRadius: shape.borderRadius,
		},
	}),
];

export const endTextStyles: SxProps<Theme> = [
	{
		mt: 2,
		fontSize: 18,
		fontWeight: 600,
	},
];
