/**
 * @file Supposed to be used as a single place for all the theming settings. As well as the root theme provider itself
 */
import React, {FunctionComponent, PropsWithChildren} from 'react';
import { createTheme, ThemeProvider } from '@mui/material';

type RootThemeProps = PropsWithChildren;
const theme = createTheme({
	colors: {
		blueTransparentLight: 'rgba(36, 57, 106, 0.04)',
		blueTransparent: 'rgba(36, 57, 106, 0.16)',
		orange: '#FF7B43',
		blue: '#24396A',
		bluePressed: '#0B1E4A',
		redPressed: '#CC162C',
		black: '#0A0A0A',
		darkGray: '#4A4E55',
		gray: '#9D9D9D',
		grayLight: '#F6F7F9',
		divider: '#EFF0F3',
		white: '#FFFFFF',
		red: '#F8223C',
		green: '#4CAF50'
	},
	shape: {
		borderRadius: 12
	},
	palette: {
		divider: '#EFF0F3'
	},
	components: {
		MuiTypography: {
			defaultProps: {
				variantMapping: {
					labelMedium: 'p',
					label: 'p'
				}
			}
		},
		MuiButtonBase: {
			defaultProps: {
				disableRipple: true
			}
		},
		MuiCssBaseline: {
			styleOverrides: {
				html: {
					height: '100%',
					backgroundColor: 'white',
				},
				body: {
					height: '100%',
					backgroundColor: '#EFF0F3',
				}
			}
		}
	}
});


theme.typography.h1 = {
	...theme.typography.h1,
	[theme.breakpoints.down('sm')]: {
		fontSize: 20
	}
};


export const RootThemeProvider: FunctionComponent<RootThemeProps> = (props) => (
	<ThemeProvider theme={theme}>
		{props.children}
	</ThemeProvider>
);
