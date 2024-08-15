import { SxProps, Theme } from '@mui/material';

export const textFieldWrapperStyles: SxProps<Theme> = [
	{ mb: 4 },
	({ breakpoints }) => ({
		[breakpoints.down('sm')]: {
			mb: 2
		}
	})
];
