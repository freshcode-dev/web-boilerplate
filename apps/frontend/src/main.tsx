import { StrictMode } from 'react';
import * as ReactDOM from 'react-dom';
import { RootThemeProvider } from './RootThemeProvider';
import { BrowserRouter } from 'react-router-dom';
import { CssBaseline } from '@mui/material';
import Root from './root';
import { GlobalStoreContextProvider } from './contexts';
import { GlobalStore } from './stores';

ReactDOM.render(
	<StrictMode>
    <GlobalStoreContextProvider value={GlobalStore}>
      <RootThemeProvider>
        <BrowserRouter>
          <CssBaseline />
          <Root />
        </BrowserRouter>
      </RootThemeProvider>
    </GlobalStoreContextProvider>
	</StrictMode>,
	document.getElementById('root')
);
