import React from 'react'

/*
    Determines the opacity of the cold/hot layer depending on which style is used.
    Returns a value 
*/
function getOpacity(temp) {
    // Hardcoded global avg max and min in CSV data
    const avg = 18.454
    const max = 28.060
    const min = 7.983

    let tempDiff = 0

    // Ensures that color intensity is with respect to max and min
    if (temp > avg) {
        tempDiff = (temp - avg) / (max - avg)
    } else if (temp < avg) {
        tempDiff = (avg - temp) / (avg - min)
    }

    // Limit opacity to 80%
    tempDiff = (tempDiff/100) * 80

    // Limit opacity to 2dp. Inspiration from:
    // (https://stackoverflow.com/questions/11832914/round-to-at-most-2-decimal-places-only-if-necessary)
    return Math.round( tempDiff * 100 + Number.EPSILON ) / 100
}

/*
    Determines if the cold or hot styles should be used
*/
function useCold(temp) {
    const avg = 18.454
    return temp < avg
}

function useHot(temp) {
    return !useCold(temp)
}

export default function RoomToggle(props) {
    // Assemble toggle div id and hotFace & coldFace html classes
    const rid = "R" + props.room_id

    const coldFaceClassName = props.room_id == 0 ? 
        "coldFace "+rid : props.room_id == 1 ?
        "coldFace bottomRoom "+rid :
        "coldFace bottomRoom"

    const hotFaceClassName = props.room_id == 0 ? 
        "hotFace "+rid : props.room_id == 1 ?
        "hotFace bottomRoom "+rid :
        "hotFace bottomRoom"
    
    // Assemble styles depending on whether room is active, cold or hot.
    const inactiveStyle = props.isActive ?
        {} : {
            background: '#A8A8A8',
            color: '#BFBFBF',
        }

    const coldStyle = !props.isActive ? 
        {} : useCold(props.avgTemp) ? {
        background: 'rgba(0,0,255,'+getOpacity(props.avgTemp)+')',
    } : {}

    const hotStyle = !props.isActive ? 
        {} : useHot(props.avgTemp) ? {
        background: 'rgba(255,0,0,'+getOpacity(props.avgTemp)+')',
        } : {}

    return (
        <div 
            className={props.className} 
            onClick={props.onClick} 
            room_id={props.room_id}
            style={inactiveStyle}    
        >
            <div className="roomTitle">{rid}</div>
            <div className={coldFaceClassName} style={coldStyle}/>
            <div className={hotFaceClassName} style={hotStyle}/>
        </div>
    )
}
