import React, { useEffect, useState } from 'react';
import Dygraph from 'dygraphs';
import { DatasCollection } from '../../api/datas';
import { useTracker } from 'meteor/react-meteor-data';
import { getFormattedData } from '../data/dataHandler'

export default function TempPanel() {
  // STATES
  // Get raw data(always updated) from minimongo
  const datas = useTracker(() => {
    const datas = DatasCollection.find().fetch()
    if (datas.length == 38962) {
      return datas;
    }
    return []
  });

  const [startDateTime, setStartDateTime] = useState(new Date("2013-10-02T05:00:00"));
  const [endDateTime, setEndDateTime] = useState(new Date("2013-10-03T05:00:00"));
  // const [startTime, setStartTime] = useState(new Date("2013-10-02T05:00:00"));
  // const [endTime, setEndTime] = useState(new Date("2013-10-03T05:00:00"));


  // Setup dygraph
  useEffect(() => {
      const formattedData = getFormattedData([... datas]);
      plotGraph(formattedData);
  }, [datas]);

  function plotGraph(data) {
    //Plot graph (hardcoded number of data)
    if (data.length > 0) {
      const g = new Dygraph('myGraph', data, {
        labels: ['Date', 'Room 0', 'Room 1', 'Room 2', 'Room 3', 'Room 4', 'Room 5', 'Room 6'],
        fillGraph: false,
        animatedZooms: true,
      });

      // updates YAYYYYYYY!!!!!!!!!!!
      g.setVisibility(0, false);
      g.updateOptions({
        dateWindow: [startDateTime, endDateTime]
      })
    }
  }

  return (
    <div className='record_flex'>
      <div className='header_section'>
        <h3>Room Temperatures</h3>
      </div>
      <div className='input_section'>
        <h3>INPUT SECTION</h3>
        <h1>Number of data: {datas.length}</h1>
        <button onClick={() => {plotGraph()}}>CLICK ME</button>
      </div>
      <div className='graph_section'>
        <div id='myGraph'></div>
      </div>
    </div>
  );
}
