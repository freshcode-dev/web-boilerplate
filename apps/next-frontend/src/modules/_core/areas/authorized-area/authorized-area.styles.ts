import { SxProps, Theme } from '@mui/material';
import { fontColor, fontColorVar, grayColorVar, redColorVar, theme } from 'src/theme/theme';

export const authorizedLayoutContainerStyles: SxProps<Theme> = {
	display: 'flex',
	flexDirection: 'column',
	height: '100%',

	[fontColorVar]: theme.colors.black,
	[grayColorVar]: theme.colors.gray,
	[redColorVar]: theme.colors.red,

	color: fontColor,

	'& *::-webkit-scrollbar': {
		width: '8px',
		height: '4px',
	},

	/* Track */
	'& *::-webkit-scrollbar-track': {
		background: '#EAEAEA',
		borderRadius: '16px',
	},

	/* Handle */
	'& *::-webkit-scrollbar-thumb': {
		background: '#CCC',
		borderRadius: '24px',
	},

	/* Handle on hover */
	'& *::-webkit-scrollbar-thumb:hover': {
		background: '#AAA',
	},
};

export const authorizedLayoutWrapperStyles: SxProps<Theme> = {
	display: 'flex',
	flex: 1,
	overflow: 'hidden',
	height: '100%',
};

export const getMainPaperStyles = (isMobile?: boolean): SxProps<Theme> => ({
	flex: 1,
	display: 'flex',
	flexDirection: 'column',
	overflow: 'auto',
	position: 'relative',
	height: '100%',
	minHeight: '100px',
	color: 'inherit',
	...(isMobile ? { mb: 0.5 } : { borderBottomRightRadius: 0, borderBottomLeftRadius: 0 }),
});

export const getAppWrapperStyles = (isMobile?: boolean): SxProps<Theme> => [
	{
		height: '100%',
		flex: 1,
		display: 'flex',
		overflow: { xs: 'auto', sm: 'hidden' },
		flexDirection: 'column',
	},
	isMobile ? { px: 1, pt: 0.5 } : { pr: 2, pl: 1, pt: 2 },
];

export const getAppContentWrapperStyles = (isFlatBottom?: boolean): SxProps<Theme> => ({
	backgroundColor: (theme) => theme.colors.white,
	borderRadius: 1,
	height: '100%',
	pb: isFlatBottom ? 0 : 3,
});

export const getMainStyles = (isMobile?: boolean, isFlatBottom?: boolean): SxProps<Theme> => ({
	height: 'calc(100% - 40px - 24px - 24px)',
	display: 'flex',
	flexDirection: 'column',
	overflow: 'auto',
	mt: isMobile ? 0.5 : 0,
});
