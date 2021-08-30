import update from 'immutability-helper';
import { v4 as uuidv4 } from 'uuid';

export function getNewAverage() {
  return {
    id: uuidv4(),
    value: 0,
    createdAt: Date.now(),
    limitCleared: false,
    limitReached: false
  };
}

export function getBarTitle(value, createdAt) {
  return `cpu load: ${value}\ntimestamp: ${new Date(
    createdAt
  ).toLocaleString()}`;
}

export function updateAverages(averages, average) {
  const updatedAverages = update(averages, {
    [averages.length - 1]: {
      value: { $set: average.value },
      createdAt: { $set: Date.now() }
    },
    $push: [getNewAverage()]
  });

  if (updatedAverages.length > 60) {
    return update(updatedAverages, { $splice: [[0, 1]] });
  }

  return updatedAverages;
}

export function setAverageAlert(averages, { isRecovery = false } = {}) {
  const prop = isRecovery ? 'limitCleared' : 'limitReached';
  return update(averages, {
    [averages.length - 1]: { [prop]: { $set: true } }
  });
}

export function getLatestAverageResponse(cpuAverages) {
  // last average in array is usually zero while we wait for next response
  // let's ignore it when we have real values
  return cpuAverages.length === 1
    ? cpuAverages[0]
    : cpuAverages[cpuAverages.length - 2];
}

export function getAverageOverTime(cpuAverages) {
  // average of all readings but excluding the "waiting" zero value
  const divisor =
    cpuAverages.length > 1 ? cpuAverages.length - 1 : cpuAverages.length;
  return cpuAverages.reduce((acc, { value }) => acc + value, 0) / divisor;
}

export function getGraphDurationInMinutes(latestAverage, firstAverage) {
  const ONE_MINUTE_IN_MS = 60000;

  if (latestAverage.createdAt) {
    const timeDiff = latestAverage.createdAt - firstAverage.createdAt;
    return Math.floor(timeDiff / ONE_MINUTE_IN_MS);
  }

  return 0;
}

export function isAboveThreshold(averageValue, hasAlerted) {
  return !hasAlerted && averageValue >= 1;
}

export function shouldTriggerAlert(numOfOccurences) {
  // 2 minutes is 120 seconds, each bar is a 10 second interval -> 12 bars on the graph
  const occurencesForAlert = (2 * 60) / 10;
  return numOfOccurences >= occurencesForAlert;
}

export async function getData(route) {
  const response = await fetch(`http://localhost:3001/${route}`);
  return await response.json();
}
