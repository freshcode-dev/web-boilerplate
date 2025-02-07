import { SxProps, Theme } from '@mui/material';

export const titleStyles: SxProps<Theme> = [
	{
		textAlign: 'center',
		mt: 6,
		mb: 2,
	},
	({ breakpoints }) => ({
		[breakpoints.down('sm')]: {
			mt: 3,
		},
	}),
];

export const labelStyles: SxProps<Theme> = [
	{
		textAlign: 'center',
		mb: 6,
		color: (theme) => theme.colors.gray,
	},
	({ breakpoints }) => ({
		[breakpoints.down('sm')]: {
			mb: 3,
		},
	}),
];

export const errorLabelTextStyles: (hasError: boolean) => SxProps<Theme> = (hasError) => [
	{
		mt: 2,
		textAlign: 'center',
		color: (theme) => (hasError ? theme.colors.red : theme.colors.black),
	},
	({ breakpoints }) => ({
		[breakpoints.down('sm')]: {
			mt: 3,
		},
	}),
];
