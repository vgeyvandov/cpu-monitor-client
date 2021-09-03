import { getNewAverage, isAboveThreshold, setAverageAlert } from './data-utils';

describe('isAboveThreshold', () => {
  it('will return true when the CPU load value is above or equal to 1', () => {
    const isAbove = isAboveThreshold(1.14434);
    expect(isAbove).toBe(true);
    const isAt = isAboveThreshold(1);
    expect(isAt).toBe(true);
  });

  it('will return false when the CPU load value is below 1', () => {
    const isBelow = isAboveThreshold(0.14434);
    expect(isBelow).toBe(false);
  });
});

describe('setAverageAlert', () => {
  it('will return an updated list of averages, with the latest average marked with the specified alert type', () => {
    const averages = [getNewAverage(), getNewAverage(), getNewAverage()];
    const updatedAverages = setAverageAlert(averages, 'warningAlert');
    expect(updatedAverages[updatedAverages.length - 1].warningAlert).toBe(true);
    expect(
      setAverageAlert(updatedAverages, 'recoveryAlert')[
        updatedAverages.length - 1
      ].recoveryAlert
    ).toBe(true);
  });
});
