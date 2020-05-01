import React, { useEffect, useState } from 'react';
import Dygraph from 'dygraphs';
import { DatasCollection } from '../../api/datas';
import { findAverageTemp, processData } from '../data/dataProcessor'
import Header from './TempPanel_Header';
import InputSection from './TempPanel_InputSection';
import moment from 'moment';

export default function TempPanel({activeRooms, setAvgTemp, match, history, setActiveRooms}) { 
  const [graphRef, setGraphRef] = useState(null);
  const [sampleSize, setSampleSize] = useState(0);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());

  // Initial setup (after page has loaded)
  useEffect(() => {
    // Plot empty graph and set its reference
    setGraphRef(plotGraph([[new Date(), 1, 1, 1, 1, 1, 1, 1]]));

    // Update startDate, endDate, sampleSize, activeRooms[] based on url params
    if (Object.keys(match.params).length != 10) {
      setStartDate(new Date("2013-10-02T05:00:00"));
      setEndDate(new Date("2013-10-03T05:00:00"));
      setSampleSize(64);
      setActiveRooms([true, true, true, true, true, true, true])
    } else {
      setStartDate(new Date(parseInt(match.params.startDate)));
      setEndDate(new Date(parseInt(match.params.endDate)));
      setSampleSize(parseInt(match.params.size));
      setActiveRooms([match.params.active0 == "true", match.params.active1 == "true", match.params.active2 == "true", match.params.active3 == "true", match.params.active4 == "true", match.params.active5 == "true", match.params.active6 == "true"])
    }
  }, []);

   // Update average temperature and graph data (whenever sample size, startdate or enddate changes)
  useEffect(() => {
    if (graphRef !== null) {
      Meteor.subscribe("default_db_data", [startDate, endDate], function() {
        // Fetch and update graph data
        const fetchedData = DatasCollection.find({ 'date' : { $gte: startDate, $lt: endDate }}).fetch();
        graphRef.updateOptions({
          file: processData(fetchedData, sampleSize)
        });

        // Set avg temp
        setAvgTemp(findAverageTemp(fetchedData));
      });

      // Set axis
      graphRef.xAxisRange()[0] = startDate.getTime();
      graphRef.xAxisRange()[1] = endDate.getTime();
    }
  }, [startDate, endDate, sampleSize]);

  // Set graph visibility (whenever active room changes)
  useEffect(() => {
    if (graphRef !== null) {
      for (let i = 0; i < activeRooms.length; i++) {
        graphRef.setVisibility(i, activeRooms[i]);
      }
    }
  }, [activeRooms]);

  // Change url (whenever params changes)
  useEffect(() => {
    history.push(`/size=${sampleSize}/startdate=${startDate.getTime()}/endate=${endDate.getTime()}/active0=${activeRooms[0]}/active1=${activeRooms[1]}/active2=${activeRooms[2]}/active3=${activeRooms[3]}/active4=${activeRooms[4]}/active5=${activeRooms[5]}/active6=${activeRooms[6]}`)
  }, [sampleSize, startDate, endDate, activeRooms]);


  
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
  }

  // Defines all the user interactions with the graph
  const graphInteractions = {
    // Zoom(Shift/alt held)/Pan starts on mouse down
    mousedown: (event, g, context) => {
      context.initializeMouseDown(event, g, context);
      if (event.altKey || event.shiftKey) {
        Dygraph.startZoom(event, g, context);
      } else { 
        Dygraph.startPan(event, g, context);
      } 
    },
    // Pan moves with mouse / Tracks mouse to mark zoom region
    mousemove: (event, g, context) => {
      if(context.isPanning) {
        Dygraph.movePan(event, g, context);
      } else if (context.isZooming) {
        Dygraph.moveZoom (event, g, context);
      }
    },
    // Mouse up ends pan movement / releases zoom region to enact zoom
    mouseup: (event, g, context) => {
      if (context.isZooming) {
        Dygraph.endZoom(event, g, context);
      } else if (context.isPanning) {
        Dygraph.endPan(event, g, context);
      }
      setStartDate(new Date(g.xAxisRange()[0]))
      setEndDate(new Date(g.xAxisRange()[1]))
    },
    // Mouse leaves graph area, if zooming or panning, do the same as a mouseup event at context
    mouseleave: (event, g, context) => {
      if (context.isZooming) {
        Dygraph.endZoom(event, g, context);
        setStartDate(new Date(g.xAxisRange()[0]))
        setEndDate(new Date(g.xAxisRange()[1]))
      } else if (context.isPanning) {
        Dygraph.endPan(event, g, context);
        setStartDate(new Date(g.xAxisRange()[0]))
        setEndDate(new Date(g.xAxisRange()[1]))
      }
    },
    mousewheel: (event, g, context) => {
      var zoomIn = event.wheelDelta > 0 ? true : false;

      zoom(g, zoomIn);
      setStartDate(new Date(g.xAxisRange()[0]))
      setEndDate(new Date(g.xAxisRange()[1]))
      event.preventDefault();
      event.stopPropagation();
    }
  };

  // Calculates the new x axis bounds upon mousewheel event.
  // zoomIn is a boolean that represents whether it is a zoom in or out event
  function zoom(g, zoomIn) {
    var axis = g.xAxisRange();
    var range = axis[1] - axis[0];

    // The asymmetric increase/decrease on the right is due to the
    // a perceived right bias upon scrolling. The right increase by 0.01
    // provides a counterweight to the zoom bias.
    var leftIncrement = range * 0.025;
    var rightIncrement = range * 0.035;

    // Assign increments according to zoom in or zoom out
    var newAxis = zoomIn? [axis[0] + leftIncrement, axis[1] - rightIncrement] 
      : [axis[0] - leftIncrement, axis[1] + rightIncrement]

    // update x axis
    g.updateOptions({
      dateWindow: newAxis
    });
  }

  // Creates the Dygraph
  function plotGraph(initialData) {
    return new Dygraph('TempGraph', initialData, {
      labels: ['Date', 'R0', 'R1', 'R2', 'R3', 'R4', 'R5', 'R6'],
      labelsDiv: 'TempGraphLegend',
      legendFormatter: legendFormatter,
      legend: 'always',
      animatedZooms: true,
      interactionModel: graphInteractions
    });
  }

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
}
