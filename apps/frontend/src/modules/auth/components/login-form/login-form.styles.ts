import { SxProps, Theme } from '@mui/material';

export const titleStyles: SxProps<Theme> = [
	{
		mt: 3,
		mb: 4,
		textAlign: 'center',
	},
	({ breakpoints }) => ({
		[breakpoints.down('sm')]: {
			my: 3,
		},
	}),
];

export const formElementStyles: SxProps<Theme> = [
	{
		mb: 2,
	},
	({ breakpoints }) => ({
		[breakpoints.down('sm')]: {
			my: 1,
		},
	}),
];
