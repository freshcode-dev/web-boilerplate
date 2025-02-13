import { SxProps, Theme } from "@mui/material";

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
