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

// Slider to adjust sample size
export default function SampleSlider({sampleSize, setSampleSize}) {
  const classes = useStyles();

  // Determines the number of steps in the slider
  // from the current sample size
  function determineStep(number) {
    for (let i = 1; i <= 12; i++) {
      if (number == Math.pow(2, i)) {
        return i;
      } else if (number < Math.pow(2, i)) {
        return i
      }
    }
    return null;
  }

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
            value={determineStep(sampleSize)}
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
