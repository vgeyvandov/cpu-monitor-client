import checkForAlert from './check-alert';
import * as dataUtils from '../data-utils';
import updateLimitTracker from './limit-tracker';

jest.mock('./limit-tracker', () => {
  return {
    __esModule: true,
    default: jest.fn(() => {})
  };
});

const latestValue = 0;
const cpuLimitCount = { current: 0 };
const cpuRecoveryCount = { current: 0 };
const triggerAlert = jest.fn();
const triggerRecovery = jest.fn();
let isAlertTriggered;

describe('checkForAlert', () => {
  beforeEach(() => {
    isAlertTriggered = false;
  });

  it('will check if value is above threshold', () => {
    jest.spyOn(dataUtils, 'isAboveThreshold');

    checkForAlert(
      latestValue,
      isAlertTriggered,
      cpuLimitCount,
      cpuRecoveryCount,
      triggerAlert,
      triggerRecovery
    );

    expect(dataUtils.isAboveThreshold).toHaveBeenCalledWith(latestValue);
  });

  it('will reset the recovery tracker if a load limit is crossed during recovery', () => {
    isAlertTriggered = true;
    cpuRecoveryCount.current = 4;
    jest.spyOn(dataUtils, 'isAboveThreshold').mockImplementation(() => true);

    checkForAlert(
      latestValue,
      isAlertTriggered,
      cpuLimitCount,
      cpuRecoveryCount,
      triggerAlert,
      triggerRecovery
    );

    expect(cpuRecoveryCount.current).toBe(0);
  });

  it('will not track increase or decrease if recovery was disrupted', () => {
    isAlertTriggered = true;
    cpuRecoveryCount.current = 4;
    jest.spyOn(dataUtils, 'isAboveThreshold').mockImplementation(() => true);

    checkForAlert(
      latestValue,
      isAlertTriggered,
      cpuLimitCount,
      cpuRecoveryCount,
      triggerAlert,
      triggerRecovery
    );

    expect(updateLimitTracker).not.toHaveBeenCalled();
  });

  it('will trigger limit tracker update', () => {
    jest.spyOn(dataUtils, 'isAboveThreshold').mockImplementation(() => true);

    checkForAlert(
      latestValue,
      isAlertTriggered,
      cpuLimitCount,
      cpuRecoveryCount,
      triggerAlert,
      triggerRecovery
    );

    expect(updateLimitTracker).toHaveBeenCalledWith(
      cpuLimitCount,
      cpuRecoveryCount
    );
  });

  it('will trigger warning if increase limit tracker returns true', () => {
    jest.spyOn(dataUtils, 'isAboveThreshold').mockImplementation(() => true);
    updateLimitTracker.mockImplementation(() => true);

    checkForAlert(
      latestValue,
      isAlertTriggered,
      cpuLimitCount,
      cpuRecoveryCount,
      triggerAlert,
      triggerRecovery
    );

    expect(triggerAlert).toHaveBeenCalled();
  });

  it('will trigger not warning if increase limit tracker returns false', () => {
    jest.spyOn(dataUtils, 'isAboveThreshold').mockImplementation(() => true);
    updateLimitTracker.mockImplementation(() => false);

    checkForAlert(
      latestValue,
      isAlertTriggered,
      cpuLimitCount,
      cpuRecoveryCount,
      triggerAlert,
      triggerRecovery
    );

    expect(triggerAlert).not.toHaveBeenCalled();
  });

  it('will trigger recovery if decrease limit tracker returns true', () => {
    isAlertTriggered = true;
    jest.spyOn(dataUtils, 'isAboveThreshold').mockImplementation(() => false);
    updateLimitTracker.mockImplementation(() => true);

    checkForAlert(
      latestValue,
      isAlertTriggered,
      cpuLimitCount,
      cpuRecoveryCount,
      triggerAlert,
      triggerRecovery
    );

    expect(triggerRecovery).toHaveBeenCalled();
  });

  it('will not trigger recovery if decrease limit tracker returns false', () => {
    isAlertTriggered = true;
    jest.spyOn(dataUtils, 'isAboveThreshold').mockImplementation(() => false);
    updateLimitTracker.mockImplementation(() => false);

    checkForAlert(
      latestValue,
      isAlertTriggered,
      cpuLimitCount,
      cpuRecoveryCount,
      triggerAlert,
      triggerRecovery
    );

    expect(triggerRecovery).not.toHaveBeenCalled();
  });
});
