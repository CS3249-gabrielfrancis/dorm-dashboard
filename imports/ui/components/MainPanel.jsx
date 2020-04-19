import React from 'react'
import BodyPanel from './BodyPanel'
import AppBar from '@material-ui/core/AppBar';
import Typography from '@material-ui/core/Typography';


export default function MainPanel() {
    return (
        <div className="main_panel">
            <AppBar position="static">
                <Typography variant="h6" className="Title">
                    Kent Ridge Hall - Temperature Monitoring Dashboard
                </Typography>
            </AppBar>
            <BodyPanel />
        </div>
    )
}
