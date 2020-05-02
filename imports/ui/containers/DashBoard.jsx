import React, { useState } from 'react';
import TempPanel from './TempPanel'
import FloorPanel from '../components/FloorPanel'
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom'

export default function DashBoard() {
  const [avgTemp, setAvgTemp] = useState([18.454, 18.454, 18.454, 18.454, 18.454, 18.454, 18.454]);
  const [activeRooms, setActiveRooms] = useState([true, true, true, true, true, true, true]);

  return(
    <div className="content_wrapper">
      <Router>
        <Switch>
          {/* If url entered is correct */}
          <Route 
            exact 
            path='/size=:size?/startdate=:startDate?/endate=:endDate?/active0=:active0?/active1=:active1?/active2=:active2?/active3=:active3?/active4=:active4?/active5=:active5?/active6=:active6?' 
            render={(props) => <TempPanel {...props} setActiveRooms={setActiveRooms} activeRooms={activeRooms} setAvgTemp={setAvgTemp} />} 
          />
          {/* If url entered is incorrect */}
          <Route 
            path='/' 
            render={(props) => <TempPanel {...props} setActiveRooms={setActiveRooms} activeRooms={activeRooms} setAvgTemp={setAvgTemp} />} 
          />
        </Switch>
      </Router>
      <FloorPanel avgTemp={avgTemp} activeRooms={activeRooms} setActiveRooms={setActiveRooms}/>
    </div>
  );
}