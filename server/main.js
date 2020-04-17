import { Meteor } from 'meteor/meteor';
import { DatasCollection } from '/imports/api/datas';
import * as Papa from 'papaparse';

Meteor.startup(() => {
  // Convert csv file into json format
  const csv = Assets.getText('room-temperatures.csv');
  const rows = Papa.parse(csv).data;

  // Empty data
  DatasCollection.remove({});
  // Initialize data
  for (let i = 1; i < rows.length; i++) {
    DatasCollection.insert({
      roomId: rows[i][0],
      date: rows[i][1],
      temp: rows[i][2],
    });
  }
});
