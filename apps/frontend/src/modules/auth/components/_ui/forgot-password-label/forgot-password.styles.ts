import { SxProps, Theme } from '@mui/material';

export const textStyles: SxProps<Theme> = {
	display: 'flex',
	flexDirection: 'row',
	alignItems: 'center',
	color: (theme) => theme.colors.gray,
};

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
