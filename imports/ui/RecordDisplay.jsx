import React, { useEffect } from 'react';
import Dygraph from 'dygraphs';

export default function RecordDisplay({ numData }) {
  // Setup dygraph
  useEffect(() => {
    new Dygraph('myGraph',
    `Date,A,B
    2016/01/01,10,20
    2016/07/01,20,10
    2016/12/31,40,30
    `, {
      fillGraph: true
    });
  }, []);
  
  return (
    <div className='record_flex'>
      <div className="header_section">
        <h1>Room Temperatures</h1>
      </div>
      <div className="input_section">
        <h1>INPUT SECTION</h1>
        <h1>Number of data: {numData}</h1>
      </div>
      <div className="graph_section">
        <h1>GRAPH SECTION</h1>
        <div id="myGraph"></div>
      </div>
    </div>
  );
}
