import { Meteor } from 'meteor/meteor';
import { DatasCollection } from '/imports/api/datas';
import * as Papa from 'papaparse';
import { getFormattedData } from './dataFormatter';

if (Meteor.isServer) {
  console.log("Publishing DataCollection..");
  Meteor.publish('default_db_data', function(dataFromClient) {
    let startDate = dataFromClient[0];
    let endDate =  dataFromClient[1];
    return DatasCollection.find({ 'date' : { $gte : startDate, $lt: endDate }});
  })
}

Meteor.startup(() => {
    // Convert csv file into json format
    const csv = Assets.getText('room-temperatures.csv');
    const rows = Papa.parse(csv).data;

    // Process rows
    console.log('Formatting data.. This will take some time..');
    const formattedData = getFormattedData(rows);

    // Empty data
    console.log('Clearing data in MongoDb..');
    DatasCollection.remove({});

    // Initialize data
    console.log('Inserting data into MongoDb..');
    for (let i = 0; i < formattedData.length; i++) {
      const tempObject = {
        date: formattedData[i][0],
        roomTemps: {
          room0: formattedData[i][1],
          room1: formattedData[i][2],
          room2: formattedData[i][3],
          room3: formattedData[i][4],
          room4: formattedData[i][5],
          room5: formattedData[i][6],
          room6: formattedData[i][7],
        },
      };
      DatasCollection.insert(tempObject);
    }
});
