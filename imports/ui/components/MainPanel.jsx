import React from "react";
import BodyPanel from "./BodyPanel";
import AppBar from "@material-ui/core/AppBar";
import { StylesProvider, createMuiTheme } from "@material-ui/core";
import { ThemeProvider } from '@material-ui/styles';

// Overrides Material UI component font and size for form labels
const theme = createMuiTheme({
    typography: {
        fontFamily: "'Barlow', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    },
    overrides: {
        MuiFormLabel: {
            root: {
                fontSize: 'larger',
            },
        },
    },
});

export default function MainPanel() {
  return (
    //CSS injection order via injectFirst: https://material-ui.com/guides/interoperability/
    <StylesProvider injectFirst>
        <ThemeProvider theme={theme}>
            <div className="main_panel">
            <AppBar position="static" className="appbar">
                <div className="logotitle">
                    <img src="/images/crest.png" alt="logo" className="logo" />
                    <span className="title">
                        Kent Ridge Hall - Temperature Monitoring Dashboard
                    </span>
                </div>
            </AppBar>
            <BodyPanel />
            </div>
        </ThemeProvider>
    </StylesProvider>
  );
}
