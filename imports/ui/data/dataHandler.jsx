// Reformat data to fit dygraphs's required format
export function getFormattedData(datas) {
  const clonedDatas = [];
  for (let i = 0; i < datas.length; i++) {
    clonedDatas.push({...datas[i]})
  }
  const distinctDates = getAllDistinctDates(clonedDatas);
  const finalData = distinctDates.map((distinctDate) => {
    return [distinctDate, null, null, null, null, null, null, null];
  });

  for (let i = 0; i < finalData.length; i++) {
    for (let j = 0; j < datas.length; j++) {
      if (isSameDates(new Date(datas[j][1]), finalData[i][0])) {
        finalData[i][parseInt(datas[j][0]) + 1] = parseFloat(datas[j][2]);
      }
    }
  }
  return finalData;
}

function getAllDistinctDates(datas) {
  // Reformat data
  for (let i = 0; i < datas.length; i++) {
    // Convert each object in datas array to array
    datas[i] = Object.values(datas[i]);
    datas[i][0] = new Date(datas[i][1]); // date
    datas[i][1] = parseFloat(datas[i][2]); // temperature
    datas[i][2] = parseInt(datas[i][3]); // roomId
    datas[i][3] = false; // boolean whether it is used
    datas[i].length = 4;
  }

  // Get all dates
  const allDates = [];
  for (let i = 0; i < datas.length; i++) {
    allDates.push(datas[i][0]);
  }

  // Get all distinct dates
  const distinctDates = [];
  for (let i = 0; i < datas.length; i++) {
    if (datas[i][3] == false) {
      distinctDates.push(datas[i][0]);
      datas[i][3] = true;
      for (let j = i + 1; j < datas.length; j++) {
        if (datas[j][3] == false && isSameDates(datas[i][0], datas[j][0])) {
          datas[j][3] = true;
        }
      }
    }
  }
  return distinctDates;
}

// Check if 2 dates are the same value
function isSameDates(date1, date2) {
  if (
    date1.getDate() === date2.getDate() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getFullYear() === date2.getFullYear() &&
    date1.getTime() === date2.getTime()
  ) {
    return true;
  }
  return false;
}