/**
 * @file Supposed to be used as a single place for all the theming settings. As well as the root theme provider itself
 */
import { PropsWithChildren } from 'react';
import { ThemeProvider } from '@mui/material';
import { EmotionCache } from '@emotion/cache';
import { CacheProvider } from '@emotion/react';
import CssBaseline from '@mui/material/CssBaseline';
import { theme } from './theme';

type RootThemeProps = PropsWithChildren<{ emotionCache: EmotionCache }>;

export function RootThemeProvider(props: RootThemeProps) {
	const { children, emotionCache } = props;

	return (
		<CacheProvider value={emotionCache}>
			<ThemeProvider theme={theme}>
				<CssBaseline />
				{children}
			</ThemeProvider>
		</CacheProvider>
	);
}
