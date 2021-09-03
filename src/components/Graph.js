import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styled, { css } from 'styled-components';
import { AVERAGE_SHAPE, COLORS, SPACE_UNIT } from '../constants';
import { healthyAnimation, warningAnimation } from '../animations';
import { getBarTitle, isAboveThreshold } from '../data-utils';
import GraphLayout from './GraphLayout';

export const GraphContainer = styled.div`
  height: 400px;
  width: 100%;
  margin-bottom: ${SPACE_UNIT * 8}px;
  position: relative;
`;

export const BarContainer = styled.div`
  height: calc(100% - ${SPACE_UNIT * 8}px + 1px);
  width: 100%;
  position: absolute;
  overflow: hidden;
`;

export const Bar = styled.div.attrs(props => ({
  style: {
    height: `${props.heightValue}%`,
    transform: `translateX(calc(200% * ${props.index}))`
  }
}))`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: calc(100% / 120);
  margin: 0 2px;
  background-color: ${COLORS.WHITE};
  position: absolute;
  bottom: 0;
  left: 0;
  transition: height 0.5s ease-out;
`;

export const Fill = styled.div`
  height: 100%;
  width: 70%;
  background-color: ${props =>
    props.isOverThreshold ? COLORS.RED : COLORS.GREEN};
  border-top-right-radius: 2px;
  border-top-left-radius: 2px;

  ${props =>
    props.isWaiting
      ? css`
          width: 25%;
          min-height: 4px;
          border-radius: 50%;
          background-color: ${props =>
            props.wasHealthy ? COLORS.GREEN : COLORS.RED};
          animation: ${props.wasHealthy ? healthyAnimation : warningAnimation}
            1s infinite;
        `
      : ''}
`;

export const Alert = styled.div`
  position: absolute;
  font-size: 12px;
  top: -${SPACE_UNIT * 3}px;
  cursor: default;
  color: ${props => (props.warningAlert ? COLORS.RED : COLORS.GREEN)};

  @media only screen and (min-width: 620px) {
    top: -${SPACE_UNIT * 6}px;
    font-size: 24px;
  }
`;

function Graph({ cpuAverages, latestAverage }) {
  const [max, setMax] = useState(2);

  return (
    <GraphContainer>
      <GraphLayout
        cpuAverages={cpuAverages}
        latestAverage={latestAverage}
        max={max}
        setMax={setMax}
      />

      <BarContainer>
        {cpuAverages.map(
          ({ id, value, createdAt, recoveryAlert, warningAlert }, index) => {
            const isWaiting = value === 0;
            const showAlert = !isWaiting && (recoveryAlert || warningAlert);
            return (
              <Bar
                key={id}
                heightValue={(value / max) * 100}
                index={index}
                title={isWaiting ? '' : getBarTitle(value, createdAt)}
              >
                <Fill
                  isOverThreshold={isAboveThreshold(value)}
                  isWaiting={isWaiting}
                  wasHealthy={!isAboveThreshold(latestAverage.value)}
                />
                {showAlert && (
                  <Alert
                    recoveryAlert={recoveryAlert}
                    warningAlert={warningAlert}
                    title={`High average load ${
                      warningAlert ? 'exceeded' : 'reduced'
                    } for 2+ minutes`}
                  >
                    {warningAlert ? '↑' : '↓'}
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
