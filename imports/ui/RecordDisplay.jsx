import React, { useEffect } from 'react';
import Dygraph from 'dygraphs';

export default function RecordDisplay({ datas }) {
  function getProcessedData(distinctDates, datas) {
    const finalData = distinctDates.map(distinctDate => {
      return [distinctDate, null, null, null, null, null, null, null]
    })

    for (let i = 0; i < finalData.length; i++) {
      for (let j = 0; j < datas.length; j++) {
        if (isSameDates(datas[j][0], finalData[i][0])) {
          finalData[i][datas[j][2] + 1] = datas[j][1];
        }
      }
    }
    return finalData;
  }
  function plotGraph(data) {
    //Plot graph (hardcoded number of data)
    if (data.length > 0) {
      new Dygraph('myGraph', data, {
        labels: ['Date', 'Room 0', 'Room 1', 'Room 2', 'Room 3', 'Room 4', 'Room 5', 'Room 6'],
        fillGraph: false,
        animatedZooms: true,
      });
    }
  }

  function isSameDates(date1, date2) {
    if (date1.getDate() === date2.getDate() 
      && date1.getMonth() === date2.getMonth()
      && date1.getFullYear() === date2.getFullYear()
      && date1.getTime() === date2.getTime()) {
        return true;
    }
    return false;
  }

  function getAllDistinctDates(datas) {
    // Reformat data
    for (let i = 0; i < datas.length; i++) {
      // Convert each object in datas array to array
      datas[i] = Object.values(datas[i]);
      datas[i][0] = new Date(datas[i][1]); // date
      datas[i][1] = parseFloat(datas[i][2]); // temperature
      datas[i][2] = parseInt(datas[i][3]); // roomId
      datas[i][3] = false; // boolean whether it is used
      datas[i].length = 4;
    }

    // Get all dates
    const allDates = [];
    for (let i = 0; i < datas.length; i++) {
      allDates.push(datas[i][0])
    }

    // Get all distinct dates
    const distinctDates = [];
    for (let i = 0; i < datas.length; i++) {
      if (datas[i][3] == false) {
        distinctDates.push(datas[i][0]);
        datas[i][3] = true;
        for (let j = i + 1; j < datas.length; j++) {
          if (datas[j][3] == false && isSameDates(datas[i][0], datas[j][0])) {
            datas[j][3] = true;
          }
        }
      }
    }
    return distinctDates;
  }

  // Setup dygraph
  useEffect(() => {
    const distinctDates = getAllDistinctDates(datas);
    const processedData = getProcessedData(distinctDates, datas);
    plotGraph(processedData);
  }, [datas]);

  return (
    <div className='record_flex'>
      <div className='header_section'>
        <h1>Room Temperatures</h1>
      </div>
      <div className='input_section'>
        <h1>INPUT SECTION</h1>
        <h1>Number of data: {datas.length}</h1>
      </div>
      <div className='graph_section'>
        <h1>GRAPH SECTION</h1>
        <div id='myGraph'></div>
      </div>
    </div>
  );
}
