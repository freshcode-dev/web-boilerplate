import { SxProps, Theme } from '@mui/material';

export const navigatorStyles: SxProps<Theme> = {
	height: 80,
	borderTopRightRadius: theme => theme.shape.borderRadius,
	borderTopLeftRadius: theme => theme.shape.borderRadius
};
