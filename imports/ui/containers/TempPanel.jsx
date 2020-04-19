import React, { useEffect, useState } from 'react';
import Dygraph from 'dygraphs';
import { DatasCollection } from '../../api/datas';
import DateFnsUtils from '@date-io/date-fns';
import 'date-fns';
import Grid from '@material-ui/core/Grid';
import { MuiPickersUtilsProvider, KeyboardTimePicker, KeyboardDatePicker } from '@material-ui/pickers';


export default function TempPanel({activeRooms, setAvgTemp, setActiveRooms}) {  
  const [graphRef, setGraphRef] = useState(null);
  const [data, setData] = useState(null);
  const [startDate, setStartDate] = useState(new Date("2013-10-02T05:00:00"));
  const [endDate, setEndDate] = useState(new Date("2013-10-03T05:00:00"));
  const [startTime, setStartTime] = useState(new Date("2013-10-02T05:00:00"));
  const [endTime, setEndTime] = useState(new Date("2013-10-03T05:00:00"));

  // Plot initial graph with no data
  useEffect(() => {
    // Plot
    const initialData = [[new Date(), null, null, null, null, null, null, null]];
    const g = new Dygraph('myGraph', initialData, {
      labels: ['Date', 'Room 0', 'Room 1', 'Room 2', 'Room 3', 'Room 4', 'Room 5', 'Room 6'],
      fillGraph: false,
      animatedZooms: true,
      dateWindow: [startDate, endDate]
    });

    // Set graph reference
    setGraphRef(g);
  }, []);

  // Update graph whenever data changes
  useEffect(() => {
    if (data !== null) {
      const dataToBeFed = [];
      for (let i = 0; i < data.length; i++) {
        dataToBeFed.push([new Date(data[i].date), data[i].roomTemps.room0, data[i].roomTemps.room1, data[i].roomTemps.room2, data[i].roomTemps.room3, data[i].roomTemps.room4, data[i].roomTemps.room5, data[i].roomTemps.room6])
      }
      graphRef.updateOptions({
        file: dataToBeFed
      });
    }
  }, [data]);

   // Set data whenever startdate and enddate changes
  useEffect(() => {
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

      // Set new data
      setData(DatasCollection.find({ 'date' : { $gte : startDateTime, $lt: endDateTime }}).fetch());

      // Set axis
      graphRef.updateOptions({
        dateWindow: [startDateTime, endDateTime]
      })
    }
  }, [startDate, endDate, startTime, endTime]);

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
      <div className='room_temp_header'>
          <div className='header'>
            Room Temperatures
          </div>
      </div>
      <div className='input_section'>
         <MuiPickersUtilsProvider utils={DateFnsUtils}>
          <Grid container justify="space-around">
            <KeyboardDatePicker
              disableToolbar
              variant="inline"
              format="MM/dd/yyyy"
              margin="normal"
              id="date-picker-inline"
              label="Start Date"
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
              label="End Date"
              value={endDate}
              onChange={date => setEndDate(date)}
              KeyboardButtonProps={{
                'aria-label': 'change date',
              }}
            />
            <KeyboardTimePicker
              margin="normal"
              id="time-picker"
              label="Start Time"
              value={startTime.getTime()}
              onChange={date => setStartTime(date)}
              KeyboardButtonProps={{
                'aria-label': 'change time',
              }}
            />

            <KeyboardTimePicker
              margin="normal"
              id="time-picker"
              label="End Timer"
              value={endTime.getTime()}
              onChange={date => setEndTime(date)}
              KeyboardButtonProps={{
                'aria-label': 'change time',
              }}
            />
          </Grid>
        </MuiPickersUtilsProvider>
        <button onClick={() => {console.log("clicked button"); setActiveRooms([false, false, false, false, false, false, true]);}}>Set active room test</button>
      </div>
      <div className='graph_section'>
        <div id='myGraph'></div>
      </div>
    </div>
  );
}
