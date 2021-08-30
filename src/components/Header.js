import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { AVERAGE_SHAPE, SPACE_UNIT } from '../constants';

const GraphHeader = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const CurrentAverage = styled.div`
  padding: ${SPACE_UNIT * 4}px 0;
  font-size: 12px;

  @media only screen and (min-width: 620px) {
    font-size: 16px;
  }
`;

const GraphDataTitle = styled.div`
  padding: ${SPACE_UNIT * 2}px 0;
  color: #6b6b6b;
  font-size: 12px;

  @media only screen and (min-width: 620px) {
    font-size: 16px;
  }
`;

const CurrentAverageTotal = styled.div`
  color: #000;
`;

function Header({ averageOverTime, cpuCount, graphDuration, latestAverage }) {
  return (
    <GraphHeader>
      <CurrentAverage>
        <GraphDataTitle>
          Latest average CPU load (1 of {cpuCount} cores)
        </GraphDataTitle>
        <CurrentAverageTotal>{latestAverage.value || '--'}</CurrentAverageTotal>
      </CurrentAverage>
      <CurrentAverage>
        <GraphDataTitle>Last {graphDuration} minute average</GraphDataTitle>
        <CurrentAverageTotal>{averageOverTime || '--'}</CurrentAverageTotal>
      </CurrentAverage>
    </GraphHeader>
  );
}

Header.propTypes = {
  averageOverTime: PropTypes.number,
  cpuCount: PropTypes.number,
  graphDuration: PropTypes.number,
  latestAverage: AVERAGE_SHAPE
};

export default Header;
