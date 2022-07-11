import React, {FunctionComponent, PropsWithChildren} from 'react';
import { createTheme, ThemeProvider } from '@mui/material';

type RootThemeProps = PropsWithChildren;

export const RootThemeProvider: FunctionComponent<RootThemeProps> = (props) => {
    const theme = createTheme();

    return (
        <ThemeProvider theme={theme}>
            {props.children}
        </ThemeProvider>
    );
};
