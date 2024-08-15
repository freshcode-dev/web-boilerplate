import { SxProps, Theme } from '@mui/material';
import { grayColorVar } from 'src/theme/theme';

export const coreButtonFadeSpinnedStyles = (isCircle?: boolean): SxProps<Theme> => ({
	marginRight: isCircle ? 0 : '10px',
});

export const coreLinkButtonStyles = (theme: Theme, sxProp?: SxProps<Theme>): SxProps<Theme> => ({
	...theme.typography.body2,
	color: (theme) => theme.colors.blue,
	textDecoration: 'underline',
	'&:hover': {
		color: grayColorVar,
	},
	'&.Mui-disabled': {
		color: (theme) => theme.colors.blueTransparent,
	},
	...sxProp,
});
