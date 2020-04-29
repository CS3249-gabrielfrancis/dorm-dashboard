import React, { useEffect, useState } from 'react';
import Dygraph from 'dygraphs';
import { DatasCollection } from '../../api/datas';
import { getReducedData, getReformatedData, getAverageTemp } from '../data/dataProcessor'
import Header from './TempPanel_Header';
import InputSection from './TempPanel_InputSection';
import moment from 'moment';

export default function TempPanel({activeRooms, setAvgTemp}) {  
  const [graphRef, setGraphRef] = useState(null);
  const [data, setData] = useState(null);
  const [sampleSize, setSampleSize] = useState(128);
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

  // Update graph and average temp whenever data changes
  useEffect(() => {
    if (data !== null) {
      const averageTemp = getAverageTemp(data);
      setAvgTemp(averageTemp);
      console.log(averageTemp)

      graphRef.updateOptions({
        file: getReformatedData(data)
      });
    }
  }, [data]);

   // Set data whenever sample size, startdate or enddate changes
  useEffect(() => {
    if (graphRef !== null) {
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
      <div className='graph_section'>
        <div id='TempGraphLegend'></div>
        <div id='TempGraph'></div>
      </div>
    </div>
  );

  // Dirtily assembles the legend from the chart data
  // Note: The 'dirty' html concatenation is due to the string interpretation of the
  // dygraphs legendFormatter option. (https://github.com/danvk/dygraphs/pull/683)
  function legendFormatter(data) {
    var date = ''
    var isEmpty = false
    if (data.x == null) {
      date = '<div class="legendDate">Floor 6 Temperatures</div>'
      isEmpty = true
    } else {
      date = '<div class="legendDate">' + moment(data.x).format('DD/MM/YYYY, hh:mm:ss') + '</div>'
    }

    html = date + '<div class="legendElements">'
    data.series.forEach(function(series) {
      var label = '<div class="legendElement"><div class="legendColor" style="background:'+series.color+';">'
      +'</div>'+'&nbsp;<span class="legendElementTitle">' 
      + series.labelHTML + '</span>: '

      var labeledData = label + '<span class="legendData">'
      if (!isEmpty && series.isVisible) {
        labeledData+= series.yHTML
      } else {
        // Very hacky fix for the legends flex wrapping uncontrollably due to the length difference without data.
        labeledData+= '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' 
      }
      labeledData += '°C</span></div>';

      html += labeledData;
    });
    
    return html+'</div>';
      // return (
      //   '<div class="legendTitle">'+date+'</div>' +
      //   data.series
      //   .map(v => v.dashHTML + v.labelHTML + ': ' + v.yHTML)
      //   .join(' ')
      // );
  }


  function plotGraph(initialData) {
    return new Dygraph('TempGraph', initialData, {
      // legend: 'always',
      // title: 'Temperature vs. Time',
      labels: ['Date', 'R0', 'R1', 'R2', 'R3', 'R4', 'R5', 'R6'],
      labelsDiv: 'TempGraphLegend',
      legendFormatter: legendFormatter,
      legend: 'always',
      animatedZooms: true,
      interactionModel: {
        mousedown: (event, g, context) => {
          context.initializeMouseDown(event, g, context);
          if (event.altKey || event.shiftKey) {
            Dygraph.startZoom(event, g, context);
          } else { 
            Dygraph.startPan(event, g, context);
          } 
        },
        mousemove: (event, g, context) => {
          if(context.isPanning) {
            Dygraph.movePan(event, g, context);
          } else if (context.isZooming) {
            Dygraph.moveZoom (event, g, context);
          }
        },
        mouseup: (event, g, context) => {
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
