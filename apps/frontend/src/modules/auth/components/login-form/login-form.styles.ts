import { SxProps, Theme } from '@mui/material';

export const titleStyles: SxProps<Theme> = [
	{
		mt: 6,
		mb: 4,
		textAlign: 'center',
	},
	({ breakpoints }) => ({
		[breakpoints.down('sm')]: {
			my: 3,
		},
	}),
];

export const linkStyles: SxProps<Theme> = [
	{
		display: 'block',
		color: (theme) => theme.colors.gray,
		mb: 3,
		textDecorationColor: 'inherit',
		'&:hover': {
			textDecoration: 'underline',
		},
	},
	({ breakpoints }) => ({
		[breakpoints.down('sm')]: {
			mb: 1,
		},
	}),
];

export const formElementStyles: SxProps<Theme> = [
	{
		mb: 1,
	},
	({ breakpoints }) => ({
		[breakpoints.down('sm')]: {
			my: 1,
		},
	}),
];
