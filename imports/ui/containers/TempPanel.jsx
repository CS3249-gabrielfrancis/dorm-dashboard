import React, { useEffect, useState } from 'react';
import Dygraph from 'dygraphs';
import { getFormattedData } from '../dataHandler'
import { DatasCollection } from '../api/datas';
import { useTracker } from 'meteor/react-meteor-data';
import DateFnsUtils from '@date-io/date-fns';
import 'date-fns';
import Grid from '@material-ui/core/Grid';
import {
  MuiPickersUtilsProvider,
  KeyboardTimePicker,
  KeyboardDatePicker,
} from '@material-ui/pickers';


export default function TempPanel({activeRooms, setAvgTemp, setActiveRooms}) {
  // Get raw data(always updated) from minimongo
  const datas = useTracker(() => {
    const fetchedData = DatasCollection.find().fetch()
    if (fetchedData.length == 38962) {
      return fetchedData;
    }
    return []
  });
  
  const [graphRef, setGraphRef] = useState(null);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [startDate, setStartDate] = useState(new Date("2013-10-02T05:00:00"));
  const [endDate, setEndDate] = useState(new Date("2013-10-03T05:00:00"));
  const [startTime, setStartTime] = useState(new Date("2013-10-02T05:00:00"));
  const [endTime, setEndTime] = useState(new Date("2013-10-03T05:00:00"));
  // Starts all operations after data is fully loaded
  useEffect(() => {
    if (datas.length == 38962 && dataLoaded == false) {
      console.log('set dataloaded true')
      setDataLoaded(true);
    }
  }, [datas]);

  // Setup dygraph
  useEffect(() => {
    if (dataLoaded == true) {
      console.log('dataloaded changed')
      const clonedDatas = [];
      for (let i = 0; i < datas.length; i++) {
        clonedDatas.push({...datas[i]})
      }
      plotGraph(getFormattedData(clonedDatas), startDate, endDate, activeRooms);
    }
  }, [dataLoaded]);

   // Graph reacts to startdate and enddate changes
  useEffect(() => {
    console.log('dates changed')
    console.log('startDate', startDate)
    console.log('endDate', endDate)
    console.log('startTime', startTime)
    console.log('endTime', endTime)
    if (graphRef !== null) {
      const startDateTime = new Date();
      startDateTime.setTime(startTime.getTime())
      startDateTime.setDate(startDate.getDate())
      startDateTime.setMonth(startDate.getMonth())
      startDateTime.setFullYear(startDate.getFullYear())

      const endDateTime = new Date();
      endDateTime.setTime(endTime.getTime())
      endDateTime.setDate(endDate.getDate())
      endDateTime.setMonth(endDate.getMonth())
      endDateTime.setFullYear(endDate.getFullYear())

      console.log('start date time', startDateTime)
      console.log('end date time', startDateTime)
      graphRef.updateOptions({
        dateWindow: [startDateTime, endDateTime]
      })
    }
  }, [startDate, endDate, startTime, endTime]);

  // Graph reacts to active room changes
  useEffect(() => {
    console.log("active rooms changed")
    if (graphRef !== null) {
      for (let i = 0; i < activeRooms.length; i++) {
        graphRef.setVisibility(i, activeRooms[i]);
      }
    }
  }, [activeRooms]);


  function plotGraph(data, startDate, endDate, activeRooms) {
    console.log('replot graph')
      const g = new Dygraph('myGraph', data, {
        labels: ['Date', 'Room 0', 'Room 1', 'Room 2', 'Room 3', 'Room 4', 'Room 5', 'Room 6'],
        fillGraph: false,
        animatedZooms: true,
      });

      // Set graph reference
      setGraphRef(g);

      for (let i = 0; i <= 6; i++) {
        g.setVisibility(i, activeRooms[i]);
      }
      g.updateOptions({
        dateWindow: [startDate, endDate]
      })
  }

  return (
    <div className='panel temp_panel record_flex'>
      <div className='header_section'>
        <h3>Room Temperatures</h3>
      </div>
      <div className='input_section'>
        <h3>INPUT SECTION</h3>
         <MuiPickersUtilsProvider utils={DateFnsUtils}>
          <Grid container justify="space-around">
            <KeyboardDatePicker
              disableToolbar
              variant="inline"
              format="MM/dd/yyyy"
              margin="normal"
              id="date-picker-inline"
              label="Date picker inline"
              value={startDate}
              onChange={date => setStartDate(date)}
              KeyboardButtonProps={{
                'aria-label': 'change date',
              }}
            />
            <KeyboardDatePicker
              disableToolbar
              variant="inline"
              format="MM/dd/yyyy"
              margin="normal"
              id="date-picker-inline"
              label="Date picker inline"
              value={endDate}
              onChange={date => setEndDate(date)}
              KeyboardButtonProps={{
                'aria-label': 'change date',
              }}
            />
            <KeyboardTimePicker
              margin="normal"
              id="time-picker"
              label="Time picker"
              value={startTime.getTime()}
              onChange={date => setStartTime(date)}
              KeyboardButtonProps={{
                'aria-label': 'change time',
              }}
            />

            <KeyboardTimePicker
              margin="normal"
              id="time-picker"
              label="Time picker"
              value={endTime.getTime()}
              onChange={date => setEndTime(date)}
              KeyboardButtonProps={{
                'aria-label': 'change time',
              }}
            />
          </Grid>
        </MuiPickersUtilsProvider>
        <h1>Number of data: {datas.length}</h1>
        <button onClick={() => {console.log("clicked button"); setActiveRooms([false, false, false, false, false, false, true]);}}>CLICK ME</button>
      </div>
      <div className='graph_section'>
        <div id='myGraph'></div>
      </div>
    </div>
  );
}
