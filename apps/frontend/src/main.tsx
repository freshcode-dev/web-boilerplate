import { StrictMode } from 'react';
import * as ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { RootThemeProvider } from './RootThemeProvider';
import { BrowserRouter } from 'react-router-dom';
import { CssBaseline } from '@mui/material';
import store from './store';
import Root from './root';

const root = ReactDOM.createRoot(
	document.getElementById('root') as HTMLElement
);

root.render(
	<StrictMode>
		<Provider store={store}>
			<RootThemeProvider>
				<BrowserRouter>
					<CssBaseline />
					<Root />
				</BrowserRouter>
			</RootThemeProvider>
		</Provider>
	</StrictMode>
);
