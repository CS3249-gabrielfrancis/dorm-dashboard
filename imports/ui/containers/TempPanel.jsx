import React, { useEffect, useState } from 'react';
import Dygraph from 'dygraphs';
import { DatasCollection } from '../../api/datas';
import { getReducedData, getReformatedData, getAverageTemp } from '../data/dataProcessor'
import Header from './TempPanel_Header';
import InputSection from './TempPanel_InputSection';
import moment from 'moment';

export default function TempPanel({activeRooms, setAvgTemp, match, history, setActiveRooms}) { 
  const [graphRef, setGraphRef] = useState(null);
  const [data, setData] = useState(null);
  const [sampleSize, setSampleSize] = useState(128);
  const [startDate, setStartDate] = useState(new Date("2013-10-02T05:00:00"));
  const [endDate, setEndDate] = useState(new Date("2013-10-02T05:00:00"));

  // Initial setup
  useEffect(() => {
    // Plot empty graph and set its reference
    setGraphRef(plotGraph([[new Date(), 1, 1, 1, 1, 1, 1, 1]]));

    // Update startDate, endDate, sampleSize, activeRooms[] based on url params
    if (match.params.startDate == null || match.params.size == null || match.params.endDate == null || match.params.active0 == null
      || match.params.active1 == null || match.params.active2 == null || match.params.active3 == null || match.params.active4 == null 
      || match.params.active5 == null || match.params.active6 == null) {

      // Goes to blank data page
      history.push(`/${sampleSize}/${startDate.getTime()}/${endDate.getTime()}/${activeRooms[0]}/${activeRooms[1]}/${activeRooms[2]}/${activeRooms[3]}/${activeRooms[4]}/${activeRooms[5]}/${activeRooms[6]}`)
    } else {
      // Set params
      setStartDate(new Date(parseInt(match.params.startDate)));
      setEndDate(new Date(parseInt(match.params.endDate)));
      setSampleSize(parseInt(match.params.size));
      setActiveRooms([match.params.active0 == "true", match.params.active1 == "true", match.params.active2 == "true", match.params.active3 == "true", match.params.active4 == "true", match.params.active5 == "true", match.params.active6 == "true"])
    }
  }, []);

   // Reset data whenever sample size, startdate or enddate changes
  useEffect(() => {
    if (graphRef !== null) {
      Meteor.subscribe("default_db_data", function() {
        // Fetch data from db
        const fetchedData = DatasCollection.find({ 'date' : { $gte : startDate, $lt: endDate }}).fetch();
        const reducedData = getReducedData(fetchedData, sampleSize);

        // Set new data
        setData(reducedData);
      });

      // Set axis
      graphRef.xAxisRange()[0] = startDate.getTime();
      graphRef.xAxisRange()[1] = endDate.getTime();
    }
  }, [startDate, endDate, sampleSize]);

   // Update graph and average temp whenever data changes
   useEffect(() => {
    if (data !== null) {
      // Set avg temp
      setAvgTemp(getAverageTemp(data));

      // Update graph data
      graphRef.updateOptions({
        file: getReformatedData(data)
      });

      
      // Change url
      history.push(`/${sampleSize}/${startDate.getTime()}/${endDate.getTime()}/${activeRooms[0]}/${activeRooms[1]}/${activeRooms[2]}/${activeRooms[3]}/${activeRooms[4]}/${activeRooms[5]}/${activeRooms[6]}`)
    }
  }, [data]);

  // Set graph visibility whenever active room changes
  useEffect(() => {
    console.log(activeRooms)
    if (graphRef !== null) {
      for (let i = 0; i < activeRooms.length; i++) {
        graphRef.setVisibility(i, activeRooms[i]);
      }
    }
    // Change url
    history.push(`/${sampleSize}/${startDate.getTime()}/${endDate.getTime()}/${activeRooms[0]}/${activeRooms[1]}/${activeRooms[2]}/${activeRooms[3]}/${activeRooms[4]}/${activeRooms[5]}/${activeRooms[6]}`)
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
