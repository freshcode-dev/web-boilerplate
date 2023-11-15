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

export const formElementStyles: SxProps<Theme> = [
	{
		display: 'flex',
		justifyContent: 'space-between',
		mb: 1,
	},
	({ breakpoints }) => ({
		[breakpoints.down('sm')]: {
			my: 1,
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

export const errorLabelTextStyles: (hasError: boolean) => SxProps<Theme> = (hasError) => [
	{
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		columnGap: '0.4rem',
		mt: 4,
		color: (theme) => (hasError ? theme.colors.red : theme.colors.black),
	},
	({ breakpoints }) => ({
		[breakpoints.down('sm')]: {
			mt: 3,
		},
	}),
];
