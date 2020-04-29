import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Slider from '@material-ui/core/Slider';

const useStyles = makeStyles({
  root: {
    width: 200,
    textAlign: 'left',
    color: 'rgba(0, 0, 0, 0.54)',
  },
});


export default function SampleSlider({sampleSize, setSampleSize}) {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <div className="sample_slider">
        <div className="sample_slider_header">
            <span className="sampleTitle">Samples</span>
            <span className="sampleCount">{sampleSize}</span>
        </div>
        <Slider
            marks
            min={1}
            step={1}
            max={12}
            defaultValue={6}
            onChange={(event, newValue) => {setSampleSize(2 ** newValue);}}  
            valueLabelFormat={(x) => "2^"+x}
            valueLabelDisplay="auto"
            getAriaValueText={(x) => "2^"+x} 
            aria-labelledby="non-linear-slider"
        />
      </div>
    </div>
  );
}
