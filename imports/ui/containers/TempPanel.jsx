import React, { useEffect, useState } from 'react';
import Dygraph from 'dygraphs';
import { DatasCollection } from '../../api/datas';
import { getReducedData, getReformatedData } from '../data/dataProcessor'
import Header from './TempPanel_Header';
import InputSection from './TempPanel_InputSection';


export default function TempPanel({activeRooms, setAvgTemp, setActiveRooms}) {  
  const [graphRef, setGraphRef] = useState(null);
  const [data, setData] = useState(null);
  const [sampleSize, setSampleSize] = useState(300);
  const [startDate, setStartDate] = useState(new Date("2013-10-02T05:00:00"));
  const [endDate, setEndDate] = useState(new Date("2013-10-03T05:00:00"));

  // Plot initial graph with no data
  useEffect(() => {
    // Plot
    const initialData = [[new Date(), null, null, null, null, null, null, null]];
    const graph = plotGraph(initialData)

    // Set graph reference
    setGraphRef(graph);
  }, []);

  // Update graph whenever data changes
  useEffect(() => {
    if (data !== null) {
      graphRef.updateOptions({
        file: getReformatedData(data)
      });
    }
  }, [data]);

   // Set data whenever sample size, startdate or enddate changes
  useEffect(() => {
    if (graphRef !== null) {
      console.log("sample size, startdate or enddate changes")

      // Fetch data based on start and end date
      const fetchedData = DatasCollection.find({ 'date' : { $gte : startDate, $lt: endDate }}).fetch();
      const reducedData = getReducedData(fetchedData, sampleSize);
      // Set new data
      setData(reducedData)

      // Set axis
      graphRef.xAxisRange()[0] = startDate.getTime();
      graphRef.xAxisRange()[1] = endDate.getTime();
    }
  }, [startDate, endDate, sampleSize]);

  // Set graph visibility whenever active room changes
  useEffect(() => {
    console.log("active rooms changed")
    if (graphRef !== null) {
      for (let i = 0; i < activeRooms.length; i++) {
        graphRef.setVisibility(i, activeRooms[i]);
      }
    }
  }, [activeRooms]);

  return (
    <div className='panel temp_panel record_flex'>
      <Header />
      <InputSection 
        startDate={startDate}
        setStartDate={setStartDate}
        endDate={endDate}
        setEndDate={setEndDate}
        sampleSize={sampleSize}
        setSampleSize={setSampleSize} 
      />
      {/* testbtn */}
      {/* <button onClick={() => {console.log("clicked button"); setActiveRooms([false, false, false, false, false, false, true]);}}>Set active room test</button> */}
      <div className='graph_section'>
        <div id='myGraph'></div>
      </div>
    </div>
  );


  function plotGraph(initialData) {
    return new Dygraph('myGraph', initialData, {
      // legend: 'always',
      // title: 'Temperature vs. Time',
      labels: ['Date', 'Room 0', 'Room 1', 'Room 2', 'Room 3', 'Room 4', 'Room 5', 'Room 6'],
      animatedZooms: true,
      interactionModel: {
        mousedown: (event, g, context) => {
          console.log("start mousedown");
          context.initializeMouseDown(event, g, context);
          if (event.altKey || event.shiftKey) {
            Dygraph.startZoom(event, g, context);
          } else { 
            Dygraph.startPan(event, g, context);
          } 
        },
        mousemove: (event, g, context) => {
          console.log("mouse is moving", event, g, context);
          if(context.isPanning) {
            console.log("PANNING")
            Dygraph.movePan(event, g, context);
          } else if (context.isZooming) {
            console.log("ZOOMING")
            Dygraph.moveZoom (event, g, context);
          }
        },
        mouseup: (event, g, context) => {
          console.log("mouseup", event, g, context);
          if (context.isZooming) {
            Dygraph.endZoom(event, g, context);
          } else if (context.isPanning) {
            Dygraph.endPan(event, g, context);
          }

          setStartDate(new Date(g.xAxisRange()[0]))
          setEndDate(new Date(g.xAxisRange()[1]))
        }
      }
    });
  }
}
