import updateLimitTracker from './limit-tracker';

describe('updateLimitTracker', () => {
  it('will increment the trend it is tracking and reset the inverse trend tracker', () => {
    const highLoadTracker = { current: 0 };
    const recoveryTracker = { current: 4 };
    updateLimitTracker(highLoadTracker, recoveryTracker, () => false);
    expect(highLoadTracker.current).toBe(1);
    expect(recoveryTracker.current).toBe(0);
  });

  it('will not call alert if the tracking value is not high enough', () => {
    const highLoadTracker = { current: 11 };
    const recoveryTracker = { current: 0 };
    const shouldAlert = updateLimitTracker(highLoadTracker, recoveryTracker);
    expect(shouldAlert).toBe(false);
  });

  it('will call alert if the tracking value is high enough and clear the trend tracker for that alert', () => {
    const highLoadTracker = { current: 12 };
    const recoveryTracker = { current: 0 };
    const shouldAlert = updateLimitTracker(highLoadTracker, recoveryTracker);
    expect(shouldAlert).toBe(true);
    expect(highLoadTracker.current).toBe(0);
  });
});
