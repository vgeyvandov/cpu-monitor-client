import updateLimitTracker from './limit-tracker';
import { isAboveThreshold } from '../data-utils';

export default function checkForAlert(
  latestValue,
  isAlertTriggered,
  cpuLimitCount,
  cpuRecoveryCount,
  triggerWarning,
  triggerRecovery
) {
  const isHighLoad = isAboveThreshold(latestValue);
  const trackIncrease = !isAlertTriggered && isHighLoad;
  const trackRecovery = isAlertTriggered && !isHighLoad;
  const isRecoveryDisrupted =
    isAlertTriggered && isHighLoad && cpuRecoveryCount.current > 0;

  if (isRecoveryDisrupted) {
    cpuRecoveryCount.current = 0;
  }

  if (trackIncrease) {
    const shouldAlertWarning = updateLimitTracker(
      cpuLimitCount,
      cpuRecoveryCount
    );
    if (shouldAlertWarning) triggerWarning();
  } else if (trackRecovery) {
    const shouldAlertRecovery = updateLimitTracker(
      cpuRecoveryCount,
      cpuLimitCount
    );
    if (shouldAlertRecovery) triggerRecovery();
  }
}
