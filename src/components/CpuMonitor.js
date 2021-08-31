import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { FETCH_INTERVAL, SPACE_UNIT } from '../constants';
import {
  checkForAlert,
  getAverageOverTime,
  getData,
  getLatestAverageResponse,
  getNewAverage,
  setAverageAlert,
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
  const cpuLimitCount = useRef(0);
  const cpuRecoveryCount = useRef(0);
  const [isCpuLimitAlertTriggered, setIsCpuLimitAlertTriggered] =
    useState(false);
  const latestAverage = getLatestAverageResponse(cpuAverages);
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
    function triggerAlert() {
      setCpuAverages(averages => setAverageAlert(averages, 'limitReached'));
      setIsCpuLimitAlertTriggered(true);
    }

    function triggerRecovery() {
      setCpuAverages(averages => setAverageAlert(averages, 'limitCleared'));
      setIsCpuLimitAlertTriggered(false);
    }

    checkForAlert(
      latestAverage.value,
      isCpuLimitAlertTriggered,
      cpuLimitCount,
      cpuRecoveryCount,
      triggerAlert,
      triggerRecovery
    );
  }, [latestAverage, isCpuLimitAlertTriggered]);

  return (
    <MainContainer>
      <Header
        averageOverTime={averageOverTime}
        cpuCount={cpuCount}
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
