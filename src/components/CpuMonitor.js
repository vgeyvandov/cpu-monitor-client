import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import update from 'immutability-helper';
import { FETCH_INTERVAL, SPACE_UNIT } from '../constants';
import {
  getData,
  getNewAverage,
  isAboveThreshold,
  updateAverages
} from '../dataUtils';
import Graph from './Graph';
import Log from './Log';

const MainContainer = styled.main`
  height: 100%;
  width: calc(100% - ${SPACE_UNIT * 16}px);
  padding: 0 ${SPACE_UNIT * 8}px ${SPACE_UNIT * 4}px ${SPACE_UNIT * 8}px;
`;

const GraphHeader = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const CurrentAverage = styled.div`
  padding: ${SPACE_UNIT * 4}px 0;
`;

const GraphDataTitle = styled.div`
  padding: ${SPACE_UNIT * 2}px 0;
  color: #6b6b6b;
`;

const CurrentAverageTotal = styled.div`
  color: #000;
`;

export default function CpuMonitor() {
  const [cpuCount, setCpuCount] = useState(0);
  const [cpuAverages, setCpuAverages] = useState([getNewAverage()]);
  const [cpuLimitCount, setCpuLimitCount] = useState(0);

  // last average in array is usually zero while we wait for next response
  const latestAverage =
    cpuAverages.length === 1
      ? cpuAverages[0]
      : cpuAverages[cpuAverages.length - 2];
  const graphDuration = latestAverage.createdAt
    ? Math.ceil((latestAverage.createdAt - cpuAverages[0].createdAt) / 60000)
    : 0;
  // average of all readings, excluding the "waiting" value
  const averageOverTime =
    cpuAverages.reduce((acc, { value }) => acc + value, 0) /
    (cpuAverages.length > 1 ? cpuAverages.length - 1 : cpuAverages.length);

  useEffect(async () => {
    const { value } = await getData('cpu-count');
    setCpuCount(value);
  }, [setCpuCount]);

  useEffect(() => {
    let intervalId = null;

    async function fetchAverage() {
      const average = await getData('cpu-average');
      setCpuAverages((averages) => updateAverages(averages, average));
    }

    if (cpuCount > 0) {
      intervalId = setInterval(fetchAverage, FETCH_INTERVAL);
    }

    return () => {
      clearInterval(intervalId);
    };
  }, [cpuCount]);

  useEffect(() => {
    if (isAboveThreshold(latestAverage.value)) {
      setCpuLimitCount((count) => count + 1);
      console.log('isAboveThreshold', true);
    }
  }, [latestAverage]);

  useEffect(() => {
    // 2 minutes is 120 seconds, 12 bars on the graph
    if (cpuLimitCount >= 12) {
      setCpuAverages((averages) =>
        update(averages, {
          [averages.length - 1]: { limitReached: { $set: true } }
        })
      );
    }
  }, [cpuLimitCount]);

  return (
    <MainContainer>
      <GraphHeader>
        <CurrentAverage>
          <GraphDataTitle>
            Latest average CPU load ({cpuCount} cores)
          </GraphDataTitle>
          <CurrentAverageTotal>
            {latestAverage.value || '--'}
          </CurrentAverageTotal>
        </CurrentAverage>
        <CurrentAverage>
          <GraphDataTitle>Last {graphDuration} minute average</GraphDataTitle>
          <CurrentAverageTotal>{averageOverTime || '--'}</CurrentAverageTotal>
        </CurrentAverage>
      </GraphHeader>

      <Graph
        cpuAverages={cpuAverages}
        cpuCount={cpuCount}
        latestAverage={latestAverage}
      />

      <Log cpuAverages={cpuAverages} />
    </MainContainer>
  );
}
