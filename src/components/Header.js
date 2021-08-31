import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { AVERAGE_SHAPE, COLORS, SPACE_UNIT } from '../constants';

const GraphHeader = styled.header`
  display: flex;
  flex-direction: column;
`;

const GraphAverages = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Title = styled.h1`
  font-size: 24px;
  padding: 0;
  margin: ${SPACE_UNIT * 3}px 0 ${SPACE_UNIT}px 0;
`;

const CurrentAverage = styled.div`
  padding-bottom: ${SPACE_UNIT * 4}px;
  font-size: 12px;

  @media only screen and (min-width: 620px) {
    font-size: 16px;
  }
`;

const GraphDataTitle = styled.h2`
  padding: ${SPACE_UNIT * 2}px 0;
  margin: 0;
  color: ${COLORS.GRAY};
  font-size: 12px;
  font-weight: 400;

  @media only screen and (min-width: 620px) {
    font-size: 16px;
  }
`;

const CurrentAverageTotal = styled.div`
  color: ${COLORS.BLACK};
`;

function Header({ averageOverTime, cpuCount, latestAverage }) {
  return (
    <GraphHeader>
      <Title>CPU load monitor</Title>
      <GraphAverages>
        <CurrentAverage>
          <GraphDataTitle>
            Latest average CPU load (1 of {cpuCount} cores)
          </GraphDataTitle>
          <CurrentAverageTotal>
            {new Date(latestAverage.createdAt).toLocaleString()}:{' '}
            {latestAverage.value || '--'}
          </CurrentAverageTotal>
        </CurrentAverage>
        <CurrentAverage>
          <GraphDataTitle>Current graph average</GraphDataTitle>
          <CurrentAverageTotal>{averageOverTime || '--'}</CurrentAverageTotal>
        </CurrentAverage>
      </GraphAverages>
    </GraphHeader>
  );
}

Header.propTypes = {
  averageOverTime: PropTypes.number,
  cpuCount: PropTypes.number,
  latestAverage: AVERAGE_SHAPE
};

export default Header;
