import { StrictMode } from 'react';
import * as ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { RootThemeProvider } from './RootThemeProvider';
import { BrowserRouter } from 'react-router-dom';
import { CssBaseline } from '@mui/material';
import Root from './root';
import store from './store';

ReactDOM.render(
	<StrictMode>
      <Provider store={store}>
        <RootThemeProvider>
        <BrowserRouter>
          <CssBaseline />
          <Root />
        </BrowserRouter>
        </RootThemeProvider>
      </Provider>

	</StrictMode>,
	document.getElementById('root')
);
