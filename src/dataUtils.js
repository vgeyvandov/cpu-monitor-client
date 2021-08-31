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

export function setAverageAlert(averages, prop) {
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
  const average =
    cpuAverages.reduce((acc, { value }) => acc + value, 0) / divisor;
  return parseFloat(average.toFixed(5));
}

export function getGraphDurationInMinutes(latestAverage, firstAverage) {
  const ONE_MINUTE_IN_MS = 60000;

  if (latestAverage.value > 0) {
    const timeDiff = latestAverage.createdAt - firstAverage.createdAt;
    return Math.floor(timeDiff / ONE_MINUTE_IN_MS);
  }

  return 1;
}

export function isAboveThreshold(averageValue, hasAlerted) {
  return !hasAlerted && averageValue >= 1;
}

function isBelowThreshold(averageValue, hasAlerted) {
  return hasAlerted && averageValue < 1;
}

function shouldTriggerAlert(numOfOccurences) {
  const occurencesForAlert = 13;
  return numOfOccurences >= occurencesForAlert;
}

export function checkForAlert(
  latestValue,
  isAlertTriggered,
  cpuLimitCount,
  cpuRecoveryCount,
  triggerAlert,
  triggerRecovery
) {
  const trackIncrease = isAboveThreshold(latestValue, isAlertTriggered);
  const trackRecovery = isBelowThreshold(latestValue, isAlertTriggered);

  if (trackIncrease) {
    cpuLimitCount.current++;
    cpuRecoveryCount.current = 0;

    if (shouldTriggerAlert(cpuLimitCount.current)) {
      cpuLimitCount.current = 0;
      triggerAlert();
    }
  } else if (trackRecovery) {
    cpuRecoveryCount.current++;
    cpuLimitCount.current = 0;

    if (shouldTriggerAlert(cpuRecoveryCount.current)) {
      cpuRecoveryCount.current = 0;
      triggerRecovery();
    }
  }
}

export async function getData(route) {
  const response = await fetch(`http://localhost:3001/${route}`);
  return await response.json();
}
