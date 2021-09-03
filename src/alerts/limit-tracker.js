/*
 *
 * updateLimitTracker will increment the current trend we are tracking (high cpu load or recovery),
 * and resets the inverse of that trend. If the trend exceeds 2 minutes,
 * the counter for that trend will be reset and a true value returned.
 *
 */

export default function updateLimitTracker(
  trackingCount,
  inverseTrackingCount
) {
  trackingCount.current++;
  inverseTrackingCount.current = 0;

  // 2 minutes is 120 seconds, each bar is a 10 second interval -> 12 bars on the graph
  if (trackingCount.current > 12) {
    trackingCount.current = 0;
    return true;
  }

  return false;
}
