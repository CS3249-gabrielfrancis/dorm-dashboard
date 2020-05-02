import Dygraph from 'dygraphs';
import moment from 'moment';

// Creates the Dygraph
export function plotGraph(initialData, setStartDate, setEndDate) {
  return new Dygraph('TempGraph', initialData, {
    labels: ['Date', 'R0', 'R1', 'R2', 'R3', 'R4', 'R5', 'R6'],
    labelsDiv: 'TempGraphLegend',
    legendFormatter: legendFormatter,
    legend: 'always',
    animatedZooms: true,
    interactionModel: graphInteractions(setStartDate, setEndDate),
  });
}

// Defines all the user interactions with the graph
function graphInteractions(setStartDate, setEndDate) {
  return {
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
      if (context.isPanning) {
        Dygraph.movePan(event, g, context);
      } else if (context.isZooming) {
        Dygraph.moveZoom(event, g, context);
      }
    },
    // Mouse up ends pan movement / releases zoom region to enact zoom
    mouseup: (event, g, context) => {
      if (context.isZooming) {
        Dygraph.endZoom(event, g, context);
      } else if (context.isPanning) {
        Dygraph.endPan(event, g, context);
      }
      setStartDate(new Date(g.xAxisRange()[0]));
      setEndDate(new Date(g.xAxisRange()[1]));
    },
    // Mouse leaves graph area, if zooming or panning, do the same as a mouseup event at context
    mouseleave: (event, g, context) => {
      if (context.isZooming) {
        Dygraph.endZoom(event, g, context);
        setStartDate(new Date(g.xAxisRange()[0]));
        setEndDate(new Date(g.xAxisRange()[1]));
      } else if (context.isPanning) {
        Dygraph.endPan(event, g, context);
        setStartDate(new Date(g.xAxisRange()[0]));
        setEndDate(new Date(g.xAxisRange()[1]));
      }
    },
    mousewheel: (event, g, context) => {
      var zoomIn = event.wheelDelta > 0 ? true : false;

      zoom(g, zoomIn);
      setStartDate(new Date(g.xAxisRange()[0]));
      setEndDate(new Date(g.xAxisRange()[1]));
      event.preventDefault();
      event.stopPropagation();
    },
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
    var newAxis = zoomIn
      ? [axis[0] + leftIncrement, axis[1] - rightIncrement]
      : [axis[0] - leftIncrement, axis[1] + rightIncrement];

    // update x axis
    g.updateOptions({
      dateWindow: newAxis,
    });
  }
}

// Dirtily assembles the legend from the chart data
// Note: The 'dirty' html concatenation is due to the string interpretation of the
// dygraphs legendFormatter option. (https://github.com/danvk/dygraphs/pull/683)
function legendFormatter(data) {
  var date = '';
  var isEmpty = false;
  if (data.x == null) {
    date = '<div class="legendDate">Floor 6 Temperatures</div>';
    isEmpty = true;
  } else {
    date =
      '<div class="legendDate">' +
      moment(data.x).format('DD/MM/YYYY, hh:mm:ss') +
      '</div>';
  }

  html = date + '<div class="legendElements">';
  data.series.forEach(function (series) {
    var label =
      '<div class="legendElement"><div class="legendColor" style="background:' +
      series.color +
      ';">' +
      '</div>' +
      '&nbsp;<span class="legendElementTitle">' +
      series.labelHTML +
      '</span>: ';

    var labeledData = label + '<span class="legendData">';
    if (!isEmpty && series.isVisible) {
      labeledData += series.yHTML;
    } else {
      // Very hacky fix for the legends flex wrapping uncontrollably due to the length difference without data.
      labeledData +=
        '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;';
    }
    labeledData += '°C</span></div>';

    html += labeledData;
  });

  return html + '</div>';
}
