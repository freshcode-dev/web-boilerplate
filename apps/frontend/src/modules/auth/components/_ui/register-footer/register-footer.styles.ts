import { SxProps, Theme } from '@mui/material';

export const linkStyles: SxProps<Theme> = {
	color: 'inherit',
	textDecorationColor: 'inherit',
	textDecoration: 'none',
	'&:hover': {
		textDecoration: 'underline'
	}
};

export const containerStyles: SxProps<Theme> = [
	{
		py: 5,
		textAlign: 'center',
	},
	({ breakpoints }) => ({
		[breakpoints.down('sm')]: {
			p: 2,
			mt: 0.5,
			borderRadius: 1,
			bgcolor: theme => theme.colors.white
		}
	})
];
