import { styled, Theme } from '@mui/material/styles';
import { CSSObject, Drawer as MuiDrawer, DrawerProps } from '@mui/material';
import {
	DRAWER_WIDTH,
	DRAWER_COLLAPSED_WIDTH,
	LOGO_WIDTH,
	LOGO_COLLAPSED_WIDTH
} from '../../../constants/components.constants';
import { AppLogo } from '../../../constants/icons.constants';
import { StyledComponent } from "@emotion/styled";

const createAnimation = (theme: Theme, start: number, end: number, open?: boolean): CSSObject => ({
	transition: theme.transitions.create('width', {
		easing: theme.transitions.easing.sharp,
		duration: open
			? theme.transitions.duration.enteringScreen
			: theme.transitions.duration.leavingScreen,
	}),
	overflowX: 'hidden',
	width: open ? start : end,
});

export const DrawerBase: StyledComponent<DrawerProps> = styled(MuiDrawer, { shouldForwardProp: name => name !== 'open' })(({ theme, open }) => {
	const animation = createAnimation(theme, DRAWER_WIDTH, DRAWER_COLLAPSED_WIDTH, open);

	return {
		...animation,
		whiteSpace: 'nowrap',
		'& .MuiDrawer-paper': {
			width: DRAWER_WIDTH,
			borderRight: 'none',
			marginTop: theme.spacing(2),
			height: `calc(100% - ${theme.spacing(2)})`,
			borderTopRightRadius: theme.shape.borderRadius,
			...animation
		},
	};
});


export const DrawerLogo = styled(AppLogo)(({ theme, open }) =>
	createAnimation(theme, LOGO_WIDTH, LOGO_COLLAPSED_WIDTH, open)
);
