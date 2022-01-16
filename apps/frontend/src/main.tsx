import { StrictMode } from 'react';
import * as ReactDOM from 'react-dom';
import { RootThemeProvider } from './RootThemeProvider';
import { BrowserRouter } from 'react-router-dom';
import { CssBaseline } from '@mui/material';
import Root from './root';

ReactDOM.render(
	<StrictMode>
		<RootThemeProvider>
			<BrowserRouter>
				<CssBaseline />
				<Root />
			</BrowserRouter>
		</RootThemeProvider>
	</StrictMode>,
	document.getElementById('root')
);
