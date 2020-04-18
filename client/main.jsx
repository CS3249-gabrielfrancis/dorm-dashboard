import React from 'react';
import { Meteor } from 'meteor/meteor';
import { render } from 'react-dom';
import DashBoard from '/imports/ui/DashBoard';

Meteor.startup(() => {
  render(<DashBoard />, document.getElementById('react-target'));
});
