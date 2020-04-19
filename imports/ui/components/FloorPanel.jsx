import React from 'react';
import FloorPlan from './FloorPlan/FloorPlan.jsx';

export default function FloorPanel() {
  return (
    <div className='panel floor_panel'>
        <div className='floor_header'>
            <div className='header'>
                Floor 6
            </div>
        </div>
        <FloorPlan />
    </div>
  );
}
