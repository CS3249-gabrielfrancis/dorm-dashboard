export function getReducedData(data, sampleSize) {
  let filteredData = [];
  // Filter data based on sample size
  if (sampleSize != 0) {
    if (data.length > sampleSize) {
      const skipValue = data.length / sampleSize;

      let numDataCollected = 0;
      let currentIndex = 0;
      while (numDataCollected < sampleSize) {
        filteredData.push(data[Math.floor(currentIndex)]);
        currentIndex += skipValue;
        numDataCollected += 1;
      }
    } else {
      filteredData = data;
    }
  }
  return filteredData;
}

export function getReformatedData(data) {
  const dataToBeFed = [];
  for (let i = 0; i < data.length; i++) {
    dataToBeFed.push([
      new Date(data[i].date),
      data[i].roomTemps.room0,
      data[i].roomTemps.room1,
      data[i].roomTemps.room2,
      data[i].roomTemps.room3,
      data[i].roomTemps.room4,
      data[i].roomTemps.room5,
      data[i].roomTemps.room6,
    ]);
  }
  return dataToBeFed;
}

export function getAverageTemp(data) {
  let totalRoom0Temp = 0;
  let totalRoom1Temp = 0;
  let totalRoom2Temp = 0;
  let totalRoom3Temp = 0;
  let totalRoom4Temp = 0;
  let totalRoom5Temp = 0;
  let totalRoom6Temp = 0;
  let totalRoom0Count = 0;
  let totalRoom1Count = 0;
  let totalRoom2Count = 0;
  let totalRoom3Count = 0;
  let totalRoom4Count = 0;
  let totalRoom5Count = 0;
  let totalRoom6Count = 0;
  for (let i = 0; i < data.length; i++) {
    let currentRoom0Temp = data[i].roomTemps.room0;
    let currentRoom1Temp = data[i].roomTemps.room1;
    let currentRoom2Temp = data[i].roomTemps.room2;
    let currentRoom3Temp = data[i].roomTemps.room3;
    let currentRoom4Temp = data[i].roomTemps.room4;
    let currentRoom5Temp = data[i].roomTemps.room5;
    let currentRoom6Temp = data[i].roomTemps.room6;
    if (currentRoom0Temp != null) {
      totalRoom0Temp += currentRoom0Temp;
      totalRoom0Count += 1;
    }
    if (currentRoom1Temp != null) {
      totalRoom1Temp += currentRoom1Temp;
      totalRoom1Count += 1;
    }
    if (currentRoom2Temp != null) {
      totalRoom2Temp += currentRoom2Temp;
      totalRoom2Count += 1;
    }
    if (currentRoom3Temp != null) {
      totalRoom3Temp += currentRoom3Temp;
      totalRoom3Count += 1;
    }
    if (currentRoom4Temp != null) {
      totalRoom4Temp += currentRoom4Temp;
      totalRoom4Count += 1;
    }
    if (currentRoom5Temp != null) {
      totalRoom5Temp += currentRoom5Temp;
      totalRoom5Count += 1;
    }
    if (currentRoom6Temp != null) {
      totalRoom6Temp += currentRoom6Temp;
      totalRoom6Count += 1;
    }
  }
  return [
    totalRoom0Temp / totalRoom0Count,
    totalRoom1Temp / totalRoom1Count,
    totalRoom2Temp / totalRoom2Count,
    totalRoom3Temp / totalRoom3Count,
    totalRoom4Temp / totalRoom4Count,
    totalRoom5Temp / totalRoom5Count,
    totalRoom6Temp / totalRoom6Count,
  ];
}
