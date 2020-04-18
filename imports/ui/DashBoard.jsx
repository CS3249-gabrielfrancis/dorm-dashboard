import React from 'react';
import RecordDisplay from './TempPanel'
import TempPanel from './FloorPanel'

export default function DashBoard() {
  return(
    <div className="content_wrapper">
      <RecordDisplay />
      <TempPanel />
    </div>
  );
}