import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Slider from '@material-ui/core/Slider';

const useStyles = makeStyles({
  root: {
    width: 400,
  },
});

export default function SampleSlider({sampleSize, setSampleSize}) {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Typography id="discrete-slider-small-steps" gutterBottom>
        Sample Size
      </Typography>
      <Slider
        step={50}
        marks
        min={0}
        max={5000}
        value={sampleSize}
        onChange={(event, newValue) => {setSampleSize(newValue);}}
      
        valueLabelDisplay="auto"
      />
    </div>
  );
}
