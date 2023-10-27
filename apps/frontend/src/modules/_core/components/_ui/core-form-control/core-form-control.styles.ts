import { SxProps, Theme } from '@mui/material';

export const labelStyle: SxProps<Theme> = {
	fontSize: 12,
	fontWeight: 300,
	lineHeight: 1.2,
	color: theme => theme.colors.gray,
	'&.Mui-error': {
		color: theme => theme.colors.red
	},
	'&.Mui-disabled': {
		color: theme => theme.colors.blueTransparent
	}
};
