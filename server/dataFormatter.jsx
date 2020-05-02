// Reformat data to be inserted into db
export function getFormattedData(datas) {
  const distinctDates = getAllDistinctDates(datas);
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
  const distinctDatesStrings = [...new Set(datas.map((data) => data[1]))];
  const distinctDates = distinctDatesStrings.map(
    (distinctDatesString) => new Date(distinctDatesString)
  );
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
