import { SxProps, Theme } from '@mui/material';

export const labelStyles: SxProps<Theme> = [
	{
		textAlign: 'center',
		mb: 6,
		color: theme => theme.colors.gray
	},
];

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

export const textFieldWrapperStyles: SxProps<Theme> = [
	{ mb: 4 },
	({ breakpoints }) => ({
		[breakpoints.down('sm')]: {
			mb: 2
		}
	})
];
