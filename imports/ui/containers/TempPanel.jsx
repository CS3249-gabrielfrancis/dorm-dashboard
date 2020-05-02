import React, { useEffect, useState } from 'react';
import { DatasCollection } from '../../api/datas';
import { findAverageTemp, processData } from '../data/dataProcessor'
import Header from '../components/TempPanel/Header';
import InputSection from '../components/TempPanel/InputSection';
import { plotGraph } from '../graph/graphAPI';


export default function TempPanel({activeRooms, setAvgTemp, match, history, setActiveRooms}) { 
  const [graphRef, setGraphRef] = useState(null);
  const [sampleSize, setSampleSize] = useState(0);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());

  // Initial setup (after page has loaded)
  useEffect(() => {
    // Plot empty graph and set its reference
    setGraphRef(plotGraph([[new Date(), 1, 1, 1, 1, 1, 1, 1]], setStartDate, setEndDate));

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
