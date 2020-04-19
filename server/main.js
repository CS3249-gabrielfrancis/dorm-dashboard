import { Meteor } from 'meteor/meteor';
import { DatasCollection } from '/imports/api/datas';
import * as Papa from 'papaparse';
import { getFormattedData } from '../imports/ui/data/dataHandler'

Meteor.startup(() => {
  // Convert csv file into json format
  const csv = Assets.getText('room-temperatures.csv');
  const rows = Papa.parse(csv).data;

  // Process rows
  const formattedData = getFormattedData(rows);

  // Empty data
  DatasCollection.remove({});
  // Initialize data
  for (let i = 1; i < formattedData.length - 1; i++) {
    const tempObject = {
      date: formattedData[i][0],
      roomTemps: {
        room0: formattedData[i][1],
        room1: formattedData[i][2],
        room2: formattedData[i][3],
        room3: formattedData[i][4],
        room4: formattedData[i][5],
        room5: formattedData[i][6],
        room6: formattedData[i][7]
      }
    }
    DatasCollection.insert(tempObject);
  }
});
