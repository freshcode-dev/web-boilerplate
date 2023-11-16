import { StrictMode } from 'react';
import * as ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { RootThemeProvider } from './RootThemeProvider';
import { CssBaseline } from '@mui/material';
import store from './store';
import Root from './root';
import './i18n';
import './index.scss';
import { HelmetProvider } from 'react-helmet-async';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

root.render(
	<StrictMode>
		<HelmetProvider>
			<Provider store={store}>
				<RootThemeProvider>
					<CssBaseline />
					<Root />
				</RootThemeProvider>
			</Provider>
		</HelmetProvider>
	</StrictMode>
);
