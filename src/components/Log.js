import React, { useEffect, useState } from 'react';
import styled, { css } from 'styled-components';
import update from 'immutability-helper';
import { logAlertAnimation } from '../animations';
import { AVERAGE_SHAPE, COLORS } from '../constants';

const LogContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: ${props => (props.isExpanded ? '600px' : '240px')};
  width: 100%;
  position: relative;
  border: 1px solid ${COLORS.LIGHT_GRAY};
  border-radius: 4px;
  transition: height 0.5s ease-out;
`;

const LogTitle = styled.h3`
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0;
  padding: 0;
  font-weight: 400;
  width: 100%;
  min-height: 40px;
  color: ${COLORS.GRAY};
  border-bottom: 1px solid ${COLORS.LIGHT_GRAY};
  font-size: 12px;

  @media only screen and (min-width: 620px) {
    font-size: 16px;
  }
`;

const ExpandToggle = styled.div`
  display: ${props => (props.shouldRender ? 'block' : 'none')};
  font-size: 24px;
  color: ${COLORS.LIGHT_GRAY};
  position: absolute;
  width: 100%;
  height: 40px;
  bottom: 0;
  cursor pointer;
  text-align: center;
  background-color: white;
  transform: ${props => `rotate(${props.isExpanded ? '180' : '0'}deg)`};
  ${props =>
    `border-${props.isExpanded ? 'bottom' : 'top'}: 1px solid ${
      COLORS.LIGHT_GRAY
    };`}

  &:hover {
    color: ${COLORS.GRAY};
  }
`;

const List = styled.ul`
  height: 100%;
  width: 100%;
  overflow-y: auto;
  padding: 0 0 40px 0;
  margin: 0;
`;

const ListItem = styled.li`
  display: flex;
  justify-content: ${props => (props.noEntries ? 'center' : 'space-evenly')};
  align-items: center;
  height: ${props => (props.noEntries ? '100%' : '100px')};
  width: 100%;
  border-bottom: ${props => (props.noEntries ? '0' : '1px')} solid
    ${COLORS.LIGHT_GRAY};
  font-size: 12px;
  color: ${props => (props.warningAlert ? COLORS.RED : COLORS.BLACK)};
  animation: ${props =>
    props.isLatest && props.warningAlert
      ? css`
          ${logAlertAnimation} 3s infinite
        `
      : 'none'};
  transition: background-color 1s ease;

  &:nth-child(even) {
    background-color: #f2fbff;
  }

  @media only screen and (min-width: 620px) {
    font-size: 16px;
  }
`;

const EntryData = styled.div`
  max-width: 120px;
  font-size: ${props => (props.isTrend ? '28px' : '16px')};
  ${props =>
    props.isTrend &&
    `color: ${props.warningAlert ? COLORS.RED : COLORS.GREEN}`};
`;

function Log({ latestAverage }) {
  const [logEntries, setLogEntries] = useState([]);
  const [isExpandedLog, setIsExpandedLog] = useState(false);

  useEffect(() => {
    const didAlert = latestAverage.warningAlert || latestAverage.recoveryAlert;

    if (didAlert) {
      setLogEntries(logEntries =>
        update(logEntries, { $unshift: [latestAverage] })
      );
    }
  }, [latestAverage]);

  return (
    <LogContainer isExpanded={isExpandedLog}>
      <LogTitle>CPU load alert log</LogTitle>
      <List>
        {logEntries.map(({ id, createdAt, warningAlert, value }, index) => (
          <ListItem isLatest={index === 0} key={id} warningAlert={warningAlert}>
            <EntryData>{new Date(createdAt).toLocaleString()}</EntryData>
            <EntryData>{value}</EntryData>
            <EntryData isTrend warningAlert={warningAlert}>
              {warningAlert ? '↑' : '↓'}
            </EntryData>
          </ListItem>
        ))}
        {logEntries.length === 0 && (
          <ListItem noEntries>{'No alerts here.'}</ListItem>
        )}
      </List>
      <ExpandToggle
        shouldRender={logEntries.length > 2}
        isExpanded={isExpandedLog}
        onClick={() => setIsExpandedLog(!isExpandedLog)}
        title="Expand"
      >
        ⌄
      </ExpandToggle>
    </LogContainer>
  );
}

Log.propTypes = {
  latestAverage: AVERAGE_SHAPE
};

export default Log;
