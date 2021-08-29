import React from 'react';
import PropTypes from 'prop-types';
import styled, { css, keyframes } from 'styled-components';
import { AVERAGE_SHAPE, SPACE_UNIT } from '../constants';
import { getBarTitle, isAboveThreshold } from '../dataUtils';

const GraphContainer = styled.div`
  height: 400px;
  width: 100%;
  margin-bottom: ${SPACE_UNIT * 8}px;
  position: relative;
`;

const GraphOutline = styled.div`
  height: calc(100% - ${SPACE_UNIT * 8}px);
  width: 100%;
  border: 1px solid #dcd9d9;
  position: absolute;
  border-radius: 4px;
`;

const GraphHorizontalMark = styled.hr`
  height: 1px;
  border-width: 0;
  color: #dcd9d9;
  background-color: #dcd9d9;
  position: absolute;
  top: ${(props) => props.top}%;
  width: 100%;
  margin: 0;
`;

const GraphVerticalMark = styled.div`
  position: absolute;
  left: ${(props) => props.left}%;
  border-left: 1px dashed #dcd9d9;
  height: 100%;
`;

const MinMark = styled.div`
  position: absolute;
  font-size: 12px;
  color: #6b6b6b;

  ${(props) =>
    props.axis === 'x'
      ? css`
          bottom: -${SPACE_UNIT * 6}px;
          left: 0;
        `
      : css`
          bottom: -${SPACE_UNIT * 2}px;
          right: -${SPACE_UNIT * 4}px;
        `}
`;

const MidMark = styled.div`
  position: absolute;
  font-size: 12px;
  top: 48%;
  right: -${SPACE_UNIT * 4}px;
  color: #6b6b6b;
`;

const MaxMark = styled.div`
  position: absolute;
  font-size: 12px;
  color: #6b6b6b;

  ${(props) =>
    props.axis === 'x'
      ? css`
          bottom: -${SPACE_UNIT * 6}px;
          right: 0;
        `
      : css`
          top: -${SPACE_UNIT * 2}px;
          right: -${SPACE_UNIT * 4}px;
        `}
`;

const BarsContainer = styled.div`
  height: calc(100% - ${SPACE_UNIT * 8}px + 1px);
  width: 100%;
  position: absolute;
  overflow: hidden;
`;

const Bar = styled.div.attrs((props) => ({
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
  background-color: white;
  position: absolute;
  bottom: 0;
  left: 0;
  transition: height 0.5s ease-out;
`;

const warningAnimation = keyframes`
  0% {
    box-shadow: 0 0 0 0 rgba(255, 0, 0, 0.4);
  }
  70% {
    box-shadow: 0 0 0 10px rgba(255, 0, 0, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(255, 0, 0, 0);
  }
`;

const healthyAnimation = keyframes`
  0% {
    box-shadow: 0 0 0 0 rgba(99, 228, 99, 0.4);
  }
  70% {
    box-shadow: 0 0 0 10px rgba(99, 228, 99, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(99, 228, 99, 0);
  }
`;

const Fill = styled.div`
  height: 100%;
  width: 70%;
  background-color: ${(props) =>
    props.isOverThreshold ? '#ff4545' : '#63e463'};
  border-top-right-radius: 2px;
  border-top-left-radius: 2px;

  ${(props) =>
    props.isWaiting
      ? css`
          width: 25%;
          min-height: 4px;
          border-radius: 50%;
          background-color: ${(props) =>
            props.isHealthy ? '#63e463' : '#ff4545'};
          animation: ${props.isHealthy ? healthyAnimation : warningAnimation} 1s
            infinite;
        `
      : ''}
`;

function Graph({ cpuAverages, latestAverage }) {
  const max = 8;
  const xMinMark = new Date(cpuAverages[0].createdAt).toLocaleString();
  const xMaxMark = latestAverage.createdAt
    ? new Date(latestAverage.createdAt).toLocaleString()
    : '';

  return (
    <GraphContainer>
      <GraphOutline>
        <GraphHorizontalMark top="25" />
        <GraphHorizontalMark top="50" />
        <GraphHorizontalMark top="75" />

        <GraphVerticalMark left="25" />
        <GraphVerticalMark left="50" />
        <GraphVerticalMark left="75" />

        <MinMark axis="y">0</MinMark>
        <MidMark>{max / 2}</MidMark>
        <MaxMark axis="y">{max}</MaxMark>

        <MinMark axis="x">{xMinMark}</MinMark>
        <MaxMark axis="x">{xMaxMark}</MaxMark>
      </GraphOutline>

      <BarsContainer>
        {cpuAverages.map(({ id, value, createdAt }, index) => {
          const isWaiting = value === 0;
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
            </Bar>
          );
        })}
      </BarsContainer>
    </GraphContainer>
  );
}

Graph.propTypes = {
  cpuAverages: PropTypes.arrayOf(AVERAGE_SHAPE),
  latestAverage: AVERAGE_SHAPE
};

export default Graph;
