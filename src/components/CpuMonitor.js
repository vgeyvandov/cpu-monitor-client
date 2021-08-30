import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { FETCH_INTERVAL, SPACE_UNIT } from '../constants';
import {
  getAverageOverTime,
  getData,
  getGraphDurationInMinutes,
  getLatestAverageResponse,
  getNewAverage,
  isAboveThreshold,
  setAverageAlert,
  shouldTriggerAlert,
  updateAverages
} from '../dataUtils';
import Header from './Header';
import Graph from './Graph';
import Log from './Log';

const MainContainer = styled.main`
  height: 100%;
  width: calc(100% - ${SPACE_UNIT * 16}px);
  padding: 0 ${SPACE_UNIT * 8}px ${SPACE_UNIT * 4}px ${SPACE_UNIT * 8}px;
`;

export default function CpuMonitor() {
  const [cpuCount, setCpuCount] = useState(0);
  const [cpuAverages, setCpuAverages] = useState([getNewAverage()]);
  const [cpuLimitCount, setCpuLimitCount] = useState(0);
  const [cpuRecoveryCount, setCpuRecoveryCount] = useState(0);
  const [isCpuLimitAlertTriggered, setIsCpuLimitAlertTriggered] =
    useState(false);
  const latestAverage = getLatestAverageResponse(cpuAverages);
  const graphDuration = getGraphDurationInMinutes(
    latestAverage,
    cpuAverages[0]
  );
  const averageOverTime = getAverageOverTime(cpuAverages);

  useEffect(() => {
    async function getCpuCount() {
      const { value } = await getData('cpu-count');
      setCpuCount(value);
    }

    getCpuCount();
  }, [setCpuCount]);

  useEffect(() => {
    let intervalId = null;

    async function fetchAverage() {
      const average = await getData('cpu-average');
      setCpuAverages(averages => updateAverages(averages, average));
    }

    if (cpuCount > 0) {
      intervalId = setInterval(fetchAverage, FETCH_INTERVAL);
    }

    return () => {
      clearInterval(intervalId);
    };
  }, [cpuCount]);

  useEffect(() => {
    if (isAboveThreshold(latestAverage.value, isCpuLimitAlertTriggered)) {
      setCpuLimitCount(count => count + 1);
      setCpuRecoveryCount(0);
    } else if (isCpuLimitAlertTriggered) {
      setCpuRecoveryCount(count => count + 1);
      setCpuLimitCount(0);
    }
  }, [latestAverage, isCpuLimitAlertTriggered]);

  useEffect(() => {
    if (shouldTriggerAlert(cpuLimitCount)) {
      setCpuAverages(setAverageAlert);
      setCpuLimitCount(0);
      setIsCpuLimitAlertTriggered(true);
    }
  }, [cpuLimitCount]);

  useEffect(() => {
    if (shouldTriggerAlert(cpuRecoveryCount)) {
      setCpuAverages(averages =>
        setAverageAlert(averages, { isRecovery: true })
      );
      setCpuRecoveryCount(0);
      setIsCpuLimitAlertTriggered(false);
    }
  }, [cpuRecoveryCount]);

  return (
    <MainContainer>
      <Header
        averageOverTime={averageOverTime}
        cpuCount={cpuCount}
        graphDuration={graphDuration}
        latestAverage={latestAverage}
      />
      <Graph
        cpuAverages={cpuAverages}
        cpuCount={cpuCount}
        latestAverage={latestAverage}
      />
      <Log latestAverage={latestAverage} />
    </MainContainer>
  );
}
