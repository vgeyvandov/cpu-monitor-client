import update from 'immutability-helper';
import { v4 as uuidv4 } from 'uuid';

export function getNewAverage() {
  return { id: uuidv4(), value: 0, createdAt: Date.now() };
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

export function isAboveThreshold(averageValue) {
  return averageValue >= 1;
}

export async function getData(route) {
  const response = await fetch(`http://localhost:3001/${route}`);
  return await response.json();
}
