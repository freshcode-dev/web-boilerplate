import { SxProps, Theme } from '@mui/material';

export const labelStyle: SxProps<Theme> = {
	fontSize: 'inherit',
	lineHeight: 1.2,
	color: (theme) => theme.colors.darkGray,
	'&.Mui-error': {
		color: (theme) => theme.colors.red,
	},
	'&.Mui-disabled': {
		color: (theme) => theme.colors.blueTransparent,
	},
};
