import { Meteor } from 'meteor/meteor';
import { DatasCollection } from '/imports/api/datas';
import * as Papa from 'papaparse';

Meteor.startup(() => {
  // Convert csv file into json format
  const csv = Assets.getText('room-temperatures.csv');
  const rows = Papa.parse(csv).data;

  // causes time delay when starting, include this agn in deployment
  // Empty data
  DatasCollection.remove({});
  // Initialize data
  for (let i = 1; i < rows.length - 1; i++) {
    DatasCollection.insert({
      date: rows[i][1],
      temp: rows[i][2],
      roomId: rows[i][0],
    });
  }
});
