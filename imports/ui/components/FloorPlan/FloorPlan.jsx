import React, { Component } from 'react'
import RoomToggle from './RoomToggle'
import './FloorPlan.css'

export default function FloorPlan() {
    return (
        <div className="floorplanContainer">
        <div className="floorplan">
                <div className="basefloor" />
                <div className="column" />
                <div className="nonActiveSmallRoom closet1" />
                <div className="nonActiveSmallRoom closet2" />
                <div className="nonActiveBigRoom" />
                <RoomToggle className="ActiveRoom R0"/>
                <RoomToggle className="ActiveRoom bottomRoom R1"/>
                <RoomToggle className="ActiveRoom bottomRoom R2"/>
                <RoomToggle className="ActiveRoom bottomRoom R3"/>
                <RoomToggle className="ActiveRoom bottomRoom R4"/>
                <RoomToggle className="ActiveRoom bottomRoom R5"/>
                <RoomToggle className="ActiveRoom bottomRoom R6"/>
        </div>
        </div>
    )
}
