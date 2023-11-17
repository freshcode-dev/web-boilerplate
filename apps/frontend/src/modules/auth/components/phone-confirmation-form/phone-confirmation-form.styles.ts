import { SxProps, Theme } from '@mui/material';

export const labelStyles: SxProps<Theme> = [
	{
		textAlign: 'center',
		mb: 6,
		color: theme => theme.colors.gray
	},
	({ breakpoints }) => ({
		[breakpoints.down('sm')]: {
			mb: 3
		}
	})
];
