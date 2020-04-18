import React, { useEffect } from 'react';
import Dygraph from 'dygraphs';

export default function RecordDisplay({ datas }) {
  // Setup dygraph
  useEffect(() => {
    // Format data to be fed to dygraph
    for (let i = 0; i < datas.length; i++) {
      // Convert each object in datas array to array
      datas[i] = Object.values(datas[i]);
      datas[i][0] = new Date(datas[i][1]); // date
      datas[i][1] = parseFloat(datas[i][2]); // temperature A
      datas[i][2] = 20; // temperature B
      // datas[i][2] = parseInt(datas[i][3]); // roomId
      datas[i].length = 3;
    }

    // Testing
    if (datas.length > 1000) {
      datas[1000][1] = 10; // temperature A
      datas[1000][2] = null; // temperature B
    }

    // Plot graph (hardcoded number of data)
    if (datas.length > 30000) {
      new Dygraph(
        'myGraph', 
        datas, 
        {
          labels: ['Date', 'Temperature A', 'Temperature B'],
          fillGraph: false,
          animatedZooms: true,
        }
      );
    }

    
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
