import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { AVERAGE_SHAPE, BORDER_LINE_COLOR } from '../constants';

const LogContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: ${props => (props.isExpanded ? '600px' : '300px')};
  width: 100%;
  position: relative;
  border: 1px solid ${BORDER_LINE_COLOR};
  border-radius: 4px;
  transition: height 0.5s ease-out;
`;

const LogTitle = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  min-height: 40px;
  color: #6b6b6b;
  border-bottom: 1px solid ${BORDER_LINE_COLOR};
`;

const ExpandToggle = styled.div`
  font-size: 24px;
  color: ${BORDER_LINE_COLOR};
  position: absolute;
  width: 100%;
  height: 40px;
  bottom: 0;
  cursor pointer;
  text-align: center;
  background-color: white;
  transform: ${props => `rotate(${props.isExpanded ? '180' : '0'}deg)`};
  ${props =>
    `border-${
      props.isExpanded ? 'bottom' : 'top'
    }: 1px solid ${BORDER_LINE_COLOR};`}

  &:hover {
    color: #6b6b6b;
  }
`;

const ListItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 100px;
  width: 100%;
  border-bottom: 1px solid ${BORDER_LINE_COLOR};

  &:nth-child(even) {
    background-color: #f2fbff;
  }
`;

const List = styled.div`
  height: 100%;
  width: 100%;
  overflow-y: auto;
  padding-bottom: 40px;
`;

function Log({ latestAverage }) {
  const [log, setLog] = useState({});
  const [isExpandedLog, setIsExpandedLog] = useState(false);

  useEffect(() => {
    if (latestAverage.limitReached || latestAverage.limitCleared) {
      setLog(log => Object.assign(log, { [latestAverage.id]: latestAverage }));
    }
  }, [latestAverage]);

  return (
    <LogContainer isExpanded={isExpandedLog}>
      <LogTitle>CPU limit log</LogTitle>
      <List>
        {Object.entries(log).map(entry => (
          <ListItem key={entry.id}></ListItem>
        ))}
        <ListItem></ListItem>
        <ListItem></ListItem>
        <ListItem></ListItem>
        <ListItem></ListItem>
        <ListItem></ListItem>
        <ListItem></ListItem>
      </List>
      <ExpandToggle
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
