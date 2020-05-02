import React, { Component } from 'react'
import RoomToggle from '../../components/FloorPlan/RoomToggle'
import './FloorPlan.css'

export default function FloorPlan(props) {
    const toggle = (e) => {
        let roomNum = e.currentTarget.getAttribute('room_id')
        let roomActiveStates = []
        for (let i = 0; i < props.activeRooms.length; i++) {
            let isRoomActive = (roomNum == i) ? !props.activeRooms[i] : props.activeRooms[i]
            roomActiveStates.push(isRoomActive)
        }
        console.log("Room toggled. New state: [" + roomActiveStates +"]")
        props.setActiveRooms(roomActiveStates)
    }

    // Create rooms by mapping room numbers in order to
    // 1. Generate classnames programmatically
    // 2. Assign temperature prop based on the room number
    const rooms = [0,1,2,3,4,5,6].map((num) => {
        let className = num != 0 ? "ActiveRoom bottomRoom R"+num : "ActiveRoom R"+num;
        let avgTemp = props.avgTemp[num]
        let isActive = props.activeRooms[num]
        return <RoomToggle 
            onClick={toggle} 
            key={num} 
            room_id={num} 
            className={className}
            avgTemp={avgTemp}
            isActive={isActive}
        />
    })

    return (
        <div className="floorplanContainer">
            <div className="floorplan">
                    <div className="basefloor" />
                    <div className="column" />
                    <div className="nonActiveSmallRoom closet1" />
                    <div className="nonActiveSmallRoom closet2" />
                    <div className="nonActiveBigRoom" />
                    {rooms}                
            </div>
        </div>
    )
}
