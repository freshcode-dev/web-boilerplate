import { SxProps } from '@mui/material';
import { Theme } from '@mui/material/styles';

export const coreNavTabsStyles: SxProps<Theme> = {
	'& .MuiButtonBase-root': {
		borderTopLeftRadius: theme => theme.shape.borderRadius,
		borderTopRightRadius: theme => theme.shape.borderRadius,
	},
	'& .MuiTabs-flexContainer': {
		borderBottom: 1,
		borderColor: theme => theme.colors.divider
	}
};

export const tabIndicatorStyles: SxProps<Theme> = {
	height: '3px',
	backgroundColor: theme => theme.colors.blue,
	borderTopLeftRadius: 3,
	borderTopRightRadius: 3
};

export const tabStyle: SxProps<Theme> = {
	'&.Mui-focusVisible': {
		backgroundColor: theme => theme.colors.blueTransparent
	},
	'&.Mui-selected': {
		backgroundColor: theme => theme.colors.blueTransparentLight,
		'.nav-tabs-label': {
			color: theme => theme.colors.blue
		}
	},
	'&.Mui-selected.Mui-disabled': {
		'.nav-tabs-label': {
			color: theme => theme.colors.gray
		}
	},
	'& .nav-tabs-label': {
		color: theme => theme.colors.gray
	},
};
