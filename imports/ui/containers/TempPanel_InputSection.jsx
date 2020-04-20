import React from 'react';
import Grid from '@material-ui/core/Grid';
import { MuiPickersUtilsProvider, KeyboardTimePicker, KeyboardDatePicker } from '@material-ui/pickers';
import SampleSlider from './TempPanel_SampleSlider'
import DateFnsUtils from '@date-io/date-fns';
import 'date-fns';

export default function TempPanel_InputSection({
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  sampleSize,
  setSampleSize,
}) {
  return (
    <div className='input_section'>
      <MuiPickersUtilsProvider utils={DateFnsUtils}>
        <Grid container justify='space-around'>
          <KeyboardDatePicker
            disableToolbar
            variant='inline'
            format='MM/dd/yyyy'
            margin='normal'
            id='date-picker-inline'
            label='Start Date'
            value={startDate}
            onChange={(date) => setStartDate(date)}
            KeyboardButtonProps={{
              'aria-label': 'change date',
            }}
          />
          <KeyboardDatePicker
            disableToolbar
            variant='inline'
            format='MM/dd/yyyy'
            margin='normal'
            id='date-picker-inline'
            label='End Date'
            value={endDate}
            onChange={(date) => setEndDate(date)}
            KeyboardButtonProps={{
              'aria-label': 'change date',
            }}
          />
          <KeyboardTimePicker
            margin='normal'
            id='time-picker'
            label='Start Time'
            value={startDate.getTime()}
            onChange={(date) => setStartDate(date)}
            KeyboardButtonProps={{
              'aria-label': 'change time',
            }}
          />

          <KeyboardTimePicker
            margin='normal'
            id='time-picker'
            label='End Timer'
            value={endDate.getTime()}
            onChange={(date) => setEndDate(date)}
            KeyboardButtonProps={{
              'aria-label': 'change time',
            }}
          />
        </Grid>
      </MuiPickersUtilsProvider>
      <SampleSlider sampleSize={sampleSize} setSampleSize={setSampleSize} />
    </div>
  );
}
