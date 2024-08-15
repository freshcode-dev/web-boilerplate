import { SxProps, Theme } from '@mui/material';

export const containerStyles: SxProps<Theme> = [
	{
		display: 'flex',
		flexDirection: 'column',
		flex: 1,
		pb: 4,
	},
	({ breakpoints, shape }) => ({
		[breakpoints.down('sm')]: {
			px: 2,
			bgcolor: (theme) => theme.colors.white,
			borderBottomLeftRadius: shape.borderRadius,
			borderBottomRightRadius: shape.borderRadius,
		},
	}),
];

export const wrapperStyles: SxProps<Theme> = { flex: 1 };

export const googleAuthRowStyles: SxProps<Theme> = {
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'center',
};
