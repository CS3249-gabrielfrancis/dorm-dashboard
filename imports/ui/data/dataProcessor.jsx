export function processData(data, sampleSize) {
  const reducedData = reduceData(data, sampleSize);
  const sortedData = sortData(reducedData);
  return reformatData(sortedData);
}

export function findAverageTemp(data) {
  let totalRoomTemp = [0, 0, 0, 0, 0, 0, 0];
  let totalRoomCount = [0, 0, 0, 0, 0, 0, 0];
  for (let i = 0; i < data.length; i++) {
    let currentRoomTemp = [
      data[i].roomTemps.room0, 
      data[i].roomTemps.room1, 
      data[i].roomTemps.room2, 
      data[i].roomTemps.room3, 
      data[i].roomTemps.room4, 
      data[i].roomTemps.room5, 
      data[i].roomTemps.room6
    ];
    for (let j = 0; j <= 6; j++) {
      if (currentRoomTemp[j] != null) {
        totalRoomTemp[j] += currentRoomTemp[j];
        totalRoomCount[j] += 1;
      }
    }
  }
  return [
    totalRoomTemp[0] / totalRoomCount[0],
    totalRoomTemp[1]  / totalRoomCount[1],
    totalRoomTemp[2]  / totalRoomCount[2],
    totalRoomTemp[3]  / totalRoomCount[3],
    totalRoomTemp[4]  / totalRoomCount[4],
    totalRoomTemp[5]  / totalRoomCount[5],
    totalRoomTemp[6]  / totalRoomCount[6],
  ];
}

function reduceData(data, sampleSize) {
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

function sortData(data) {
  return data.slice().sort((a, b) => a.date - b.date)
}

function reformatData(data) {
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