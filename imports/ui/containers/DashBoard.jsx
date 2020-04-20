import React, { useState } from 'react';
import TempPanel from './TempPanel'
import FloorPanel from '../components/FloorPanel'

export default function DashBoard() {
  const [avgTemp, setAvgTemp] = useState([18.454, 18.454, 18.454, 18.454, 18.454, 18.454, 18.454]);
  const [activeRooms, setActiveRooms] = useState([true, true, true, true, true, true, true]);

  return(
    <div className="content_wrapper">
      <TempPanel activeRooms={activeRooms} setAvgTemp={setAvgTemp} />
      <FloorPanel avgTemp={avgTemp} activeRooms={activeRooms} setActiveRooms={setActiveRooms}/>
    </div>
  );
}