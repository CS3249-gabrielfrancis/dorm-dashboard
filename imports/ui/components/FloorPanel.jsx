import React from 'react';
import FloorPlan from '../containers/FloorPlan/FloorPlan';

export default function FloorPanel(props) {
  return (
    <div className='panel floor_panel'>
        <div className='floor_header'>
            <div className='header'>
                Floor 6
            </div>
        </div>
        <FloorPlan
            avgTemp={props.avgTemp} 
            activeRooms={props.activeRooms} 
            setActiveRooms={props.setActiveRooms}
        />
    </div>
  );
}
