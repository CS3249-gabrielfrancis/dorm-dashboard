import React from 'react';
import Grid from '@material-ui/core/Grid';
import { MuiPickersUtilsProvider, KeyboardTimePicker, KeyboardDatePicker } from '@material-ui/pickers';
import SampleSlider from './SampleSlider'
import DateFnsUtils from '@date-io/date-fns';
import 'date-fns';
import AccessTimeIcon from '@material-ui/icons/AccessTime';

// Input section which contains start date and end date picker, start time and end time picker
export default function InputSection({
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
        <Grid container justify='center' spacing={5} wrap='nowrap'>
          <Grid item>
            <Grid container direction="column" justify="center" alignItems="center">
                <KeyboardDatePicker
                    disableToolbar
                    variant='inline'
                    format='dd/MM/yyyy'
                    margin='normal'
                    id='start-date-picker'
                    label='Start Date'
                    value={startDate}
                    onChange={(date) => setStartDate(date)}
                    KeyboardButtonProps={{
                    'aria-label': 'change date',
                    }}
                />
                <KeyboardTimePicker
                    margin='normal'
                    id='start-time-picker'
                    label='Start Time'
                    value={startDate.getTime()}
                    onChange={(date) => setStartDate(date)}
                    KeyboardButtonProps={{
                    'aria-label': 'change time',
                    }}
                    keyboardIcon={<AccessTimeIcon />}
                />
            </Grid>
          </Grid>
          <Grid item>
            <Grid container direction="column" justify="center" alignItems="center">
                <KeyboardDatePicker
                    disableToolbar
                    variant='inline'
                    format='dd/MM/yyyy'
                    margin='normal'
                    id='end-date-picker'
                    label='End Date'
                    value={endDate}
                    onChange={(date) => setEndDate(date)}
                    KeyboardButtonProps={{
                    'aria-label': 'change date',
                    }}
                />
                <KeyboardTimePicker
                    margin='normal'
                    id='end-time-picker'
                    label='End Time'
                    value={endDate.getTime()}
                    onChange={(date) => setEndDate(date)}
                    KeyboardButtonProps={{
                    'aria-label': 'change time',
                    }}
                    keyboardIcon={<AccessTimeIcon />}
                />
            </Grid>
          </Grid>
          <Grid item>
            <SampleSlider sampleSize={sampleSize} setSampleSize={setSampleSize} />
          </Grid>
        </Grid>
      </MuiPickersUtilsProvider>
    </div>
  );
}
