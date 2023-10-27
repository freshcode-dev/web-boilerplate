import { SxProps, Theme } from '@mui/material';

export const wrapperStyles: SxProps<Theme> = [
	{ flex: 1 },
	({ breakpoints, shape }) => ({
		[breakpoints.down('sm')]: {
			px: 2,
			bgcolor: theme => theme.colors.white,
			borderBottomLeftRadius: shape.borderRadius,
			borderBottomRightRadius: shape.borderRadius
		}
	})
];
