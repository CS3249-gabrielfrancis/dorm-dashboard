import React from 'react';
import { Meteor } from 'meteor/meteor';
import { render } from 'react-dom';
import MainPanel from '/imports/ui/components/MainPanel.jsx';

// Entry point into client UI
Meteor.startup(() => {
  render(<MainPanel />, document.getElementById('root'));
});
