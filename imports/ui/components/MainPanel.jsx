import React from "react";
import BodyPanel from "./BodyPanel";
import AppBar from "@material-ui/core/AppBar";
import Typography from "@material-ui/core/Typography";
import { StylesProvider } from "@material-ui/core";

export default function MainPanel() {
  return (
    //CSS injection order via injectFirst: https://material-ui.com/guides/interoperability/
    <StylesProvider injectFirst>
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
    </StylesProvider>
  );
}
