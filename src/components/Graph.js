import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { AVERAGE_SHAPE } from '../constants';
import { getBarTitle, isAboveThreshold } from '../dataUtils';
import {
  GraphContainer,
  GraphOutline,
  GraphHorizontalMark,
  GraphVerticalMark,
  MaxInput,
  MinMark,
  MidMark,
  MaxMark,
  BarContainer,
  Bar,
  Fill,
  Alert
} from './Graph.styled';

const TEN_MINUTES_IN_MS = 600000;

function Graph({ cpuAverages, latestAverage }) {
  const [max, setMax] = useState(2);

  const endDate =
    cpuAverages.length === 60
      ? new Date(latestAverage.createdAt).toLocaleString()
      : new Date(cpuAverages[0].createdAt + TEN_MINUTES_IN_MS).toLocaleString();
  const xMinMark = new Date(cpuAverages[0].createdAt).toLocaleString();
  const xMaxMark = latestAverage.createdAt ? endDate : '';

  return (
    <GraphContainer>
      <GraphOutline>
        <GraphHorizontalMark top="25" />
        <GraphHorizontalMark top="50" />
        <GraphHorizontalMark top="75" />
        <GraphHorizontalMark
          isThresholdLine
          bottom={parseInt((1 / max) * 100)}
        />

        <GraphVerticalMark left="25" />
        <GraphVerticalMark left="50" />
        <GraphVerticalMark left="75" />

        <MinMark axis="y">0</MinMark>
        <MidMark>{max / 2}</MidMark>
        <MaxMark axis="y">
          <MaxInput
            type="number"
            value={max}
            onChange={e => e.target.value > 1 && setMax(e.target.value)}
          />
        </MaxMark>

        <MinMark axis="x">{xMinMark}</MinMark>
        <MaxMark axis="x">{xMaxMark}</MaxMark>
      </GraphOutline>

      <BarContainer>
        {cpuAverages.map(
          ({ id, value, createdAt, limitCleared, limitReached }, index) => {
            const isWaiting = value === 0;
            const showAlert = !isWaiting && (limitCleared || limitReached);
            return (
              <Bar
                key={id}
                heightValue={(value / max) * 100}
                index={index}
                title={isWaiting ? '' : getBarTitle(value, createdAt)}
              >
                <Fill
                  isHealthy={!isAboveThreshold(latestAverage.value)}
                  isOverThreshold={isAboveThreshold(value)}
                  isWaiting={isWaiting}
                />
                {showAlert && (
                  <Alert
                    limitCleared={limitCleared}
                    limitReached={limitReached}
                    title={
                      limitReached
                        ? 'High average load exceeded for 2+ minutes'
                        : 'High average load reduced for 2+ minutes'
                    }
                  >
                    {limitReached ? '↑' : '↓'}
                  </Alert>
                )}
              </Bar>
            );
          }
        )}
      </BarContainer>
    </GraphContainer>
  );
}

Graph.propTypes = {
  cpuAverages: PropTypes.arrayOf(AVERAGE_SHAPE),
  latestAverage: AVERAGE_SHAPE
};

export default Graph;
