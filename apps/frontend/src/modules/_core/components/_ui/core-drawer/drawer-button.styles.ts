import { SxProps, Theme } from '@mui/material';

export const createDrawerButtonBaseStyle = (collapsed?: boolean): SxProps<Theme> => ({
	height: 48,
	borderRadius: 1,
	width: collapsed ? '48px' : 1,
	px: 1.5,
	justifyContent: 'flex-start',
	'&:hover': {
		backgroundColor: theme => theme.colors.blueTransparentLight
	},
	'&.Mui-focusVisible, &.active.Mui-focusVisible': {
		backgroundColor: theme => theme.colors.blueTransparent
	},
	'&.active': {
		backgroundColor: theme => theme.colors.grayLight,
		'.drawer-nav-link-label': {
			color: theme => theme.colors.blue
		}
	}
});
