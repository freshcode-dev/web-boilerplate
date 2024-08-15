import { SxProps, Theme } from '@mui/material';

export const authContainerStyles: SxProps<Theme> = [{
	height: '100%',
	maxHeight: '100%',

},
({ breakpoints }) => ({
	[breakpoints.down('sm')]: {
		pl: '0 !important'
	},
}),]

export const coverImageContainerStyles: SxProps<Theme> = {
	display: { xs: 'none', md: 'flex' },
	maxHeight: '100%'
};

export const gridContainerStyles: SxProps<Theme> = [
	{
		p: 3,
		height: '100%',
		alignItems: 'stretch',
	},
	({ breakpoints }) => ({
		[breakpoints.down('sm')]: {
			p: 1,
			width: '100%',
			m: 0
		},
	}),
];

export const paperStyles: SxProps<Theme> = [{
	height: '100%',
	borderRadius: 2,
	bgcolor: (theme) => theme.colors.white,
	display: 'flex',
	flexDirection: 'column',
	alignItems: 'center',
	overflow: 'auto',
},
({ breakpoints }) => ({
	[breakpoints.down('sm')]: {
		borderRadius: '16px',
	},
}),
]

export const contentStyles: SxProps<Theme> = [
	{
		maxWidth: 440,
		px: '10px',
		width: '100%',
		display: 'flex',
		alignItems: 'center',
		flexDirection: 'column',
		flex: 1,
	},
	({ breakpoints }) => ({
		[breakpoints.down('sm')]: {
			px: 2,
		},
	}),
];

export const outletContainerStyles: SxProps<Theme> = [
	{
		display: 'flex',
		flexDirection: 'column',
		flex: 1,
		pb: 3,
		px: '0 !important',
		height: '100%',
	},
	({ breakpoints, shape }) => ({
		[breakpoints.down('sm')]: {
			bgcolor: (theme) => theme.colors.white,
			borderBottomLeftRadius: shape.borderRadius,
			borderBottomRightRadius: shape.borderRadius,
		},
	}),
];

export const headerStyles: SxProps<Theme> = [
	{
		mt: 5,
		mb: '83px',
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
	},
	({ breakpoints }) => ({
		[breakpoints.down('sm')]: {
			mb: 0,
			mt: 4,
		},
	}),
];

export const appLogoStyles: SxProps<Theme> = {
	width: 186,
	height: 30,
}

export const tabsStyles: SxProps<Theme> = [
	{
		width: '100%',
		'& .MuiTypography-root': {
			fontSize: 14,
			fontWeight: 500
		},
	},
	({ breakpoints }) => ({
		[breakpoints.down('sm')]: {
			mt: 3,
		},
	}),
];

export const sxTab: SxProps<Theme> = {
	px: 3,
	py: 2,
	height: 48,
	minHeight: 'max-content',
};

export const activeSxTab: SxProps<Theme> = {
	'&.Mui-selected': {
		backgroundColor: '#EBF5FF',
		borderRadius: '100px',
		border: '1px solid',
		borderColor: (theme) => theme.colors.blueTransparentLight,
	},
};

export const changePhoneContactStyles: SxProps<Theme> = [
	{
		color: (theme) => theme.colors.gray,
		textAlign: 'center',
		maxWidth: 480,
		px: '10px',
		my: 3
	},
	({ breakpoints }) => ({
		[breakpoints.down('sm')]: {
			maxWidth: 264,
			p: 0,
			fontSize: 10,
			lineHeight: 'normal',
			mt: 0,
			mb: 2,
		},
	}),
]
