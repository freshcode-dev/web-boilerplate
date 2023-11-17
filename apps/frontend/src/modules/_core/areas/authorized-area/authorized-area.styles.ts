import { SxProps, Theme } from "@mui/material";

export const getMainPaperStyles = (isMobile: boolean): SxProps<Theme> => ({
	flex: 1,
	pt: 3,
	display: 'flex',
	flexDirection: 'column',
	overflow: 'hidden',
	position: 'relative',
	...(isMobile
		? { mb: 0.5 }
		: { borderBottomRightRadius: 0, borderBottomLeftRadius: 0 })
});

export const getAppWrapperStyles = (isMobile: boolean): SxProps<Theme> => ([
	{
		flex: 1,
		display: 'flex',
		overflow: 'hidden',
		flexDirection: 'column'
	},
	isMobile
		? { px: 1, pt: 0.5 }
		: { pr: 2, pl: 1, pt: 2 }
]);


export const getMainStyles = (isMobile: boolean): SxProps<Theme> => ({
	flex: 1,
	display: 'flex',
	flexDirection: 'column',
	overflow: 'hidden',
	mt: isMobile ? 0.5 : 1
});

