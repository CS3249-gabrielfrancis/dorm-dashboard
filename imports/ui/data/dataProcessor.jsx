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
