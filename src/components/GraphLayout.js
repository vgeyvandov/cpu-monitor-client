import React from 'react';
import PropTypes from 'prop-types';
import styled, { css } from 'styled-components';
import { AVERAGE_SHAPE, COLORS, SPACE_UNIT } from '../constants';

export const GraphOutline = styled.div`
  height: calc(100% - ${SPACE_UNIT * 8}px);
  width: 100%;
  border: 1px solid ${COLORS.LIGHT_GRAY};
  position: absolute;
  border-radius: 4px;
`;

export const GraphHorizontalMark = styled.hr`
  height: 1px;
  border-width: 0;
  color: ${COLORS.LIGHT_GRAY};
  background-color: ${props =>
    props.isThresholdLine ? 'rgba(255, 69, 69, 0.4)' : `${COLORS.LIGHT_GRAY}`};
  transition: bottom 0.5s ease-out;
  position: absolute;
  ${props => props.top && `top: ${props.top}%;`}
  ${props => props.bottom && `bottom: ${props.bottom}%;`}
  width: 100%;
  margin: 0;
`;

export const GraphVerticalMark = styled.div`
  position: absolute;
  left: ${props => props.left}%;
  border-left: 1px dashed ${COLORS.LIGHT_GRAY};
  height: 100%;
`;

export const MinMark = styled.div`
  position: absolute;
  font-size: 12px;
  color: ${COLORS.GRAY};

  ${props =>
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

export const MidMark = styled.div`
  position: absolute;
  font-size: 12px;
  top: 48%;
  right: -${SPACE_UNIT * 4}px;
  color: ${COLORS.GRAY};
  background-color: ${COLORS.WHITE};
`;

export const MaxMark = styled.div`
  position: absolute;
  font-size: 12px;
  color: ${COLORS.GRAY};

  ${props =>
    props.axis === 'x'
      ? css`
          bottom: -${SPACE_UNIT * 6}px;
          right: 0;
        `
      : css`
          top: -${SPACE_UNIT * 3}px;
          right: -${SPACE_UNIT * 5}px;
          padding: ${SPACE_UNIT}px;
          background-color: ${COLORS.WHITE};
        `}
`;

export const MaxInput = styled.input`
  width: 36px;
`;

const TEN_MINUTES_IN_MS = 600000;

function GraphLayout({ cpuAverages, latestAverage, max, setMax }) {
  const endDate =
    cpuAverages.length === 60
      ? new Date(latestAverage.createdAt).toLocaleString()
      : new Date(cpuAverages[0].createdAt + TEN_MINUTES_IN_MS).toLocaleString();
  const xMinMark = new Date(cpuAverages[0].createdAt).toLocaleString();
  const xMaxMark = latestAverage.createdAt ? endDate : '';

  return (
    <GraphOutline>
      <GraphHorizontalMark top="25" />
      <GraphHorizontalMark top="50" />
      <GraphHorizontalMark top="75" />
      <GraphHorizontalMark isThresholdLine bottom={parseInt((1 / max) * 100)} />

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
  );
}

GraphLayout.propTypes = {
  cpuAverages: PropTypes.arrayOf(AVERAGE_SHAPE),
  latestAverage: AVERAGE_SHAPE,
  max: PropTypes.number,
  setMax: PropTypes.func
};

export default GraphLayout;
