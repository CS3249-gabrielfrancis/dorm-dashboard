import React, { useState } from 'react';
import TempPanel from './TempPanel'
import FloorPanel from '../components/FloorPanel'

export default function DashBoard() {
  const [avgTemp, setAvgTemp] = useState(25);
  const [activeRooms, setActiveRooms] = useState([true, true, true, true, true, true, true]);
  return(
    <div className="content_wrapper">
      {/* setActiveRooms passed to TempPanel for testing only */}
      <TempPanel activeRooms={activeRooms} setAvgTemp={setAvgTemp} setActiveRooms={setActiveRooms}/>
      <FloorPanel avgTemp={avgTemp} setActiveRooms={setActiveRooms}/>
    </div>
  );
}