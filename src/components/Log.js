import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { AVERAGE_SHAPE } from '../constants';

const LogContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: ${(props) => (props.isExpanded ? '600px' : '300px')};
  width: 100%;
  position: relative;
  border: 1px solid #dcd9d9;
  border-radius: 4px;
`;

const LogTitle = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  min-height: 40px;
  color: #6b6b6b;
  border-bottom: 1px solid #dcd9d9;
`;

const ExpandToggle = styled.div`
  font-size: 24px;
  color: #dcd9d9;
  position: absolute;
  width: 100%;
  height: 40px;
  bottom: 0;
  cursor pointer;
  text-align: center;
  background-color: white;
  transform: ${(props) => `rotate(${props.isExpanded ? '180' : '0'}deg)`};
  ${(props) =>
    `border-${props.isExpanded ? 'bottom' : 'top'}: 1px solid #dcd9d9;`}

  &:hover {
    color: #6b6b6b;
  }
`;

const ListItem = styled.div`
  height: 100px;
  width: 100%;
  border-bottom: 1px solid #dcd9d9;

  &:nth-child(even) {
    background-color: #eff1ff;
  }
`;

const List = styled.div`
  height: 100%;
  width: 100%;
  overflow-y: auto;
  padding-bottom: 40px;
`;

function Log({ cpuAverages }) {
  const [isExpandedLog, setIsExpandedLog] = useState(false);
  console.log(cpuAverages);

  return (
    <LogContainer isExpanded={isExpandedLog}>
      <LogTitle>CPU limit log</LogTitle>
      <List>
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
  cpuAverages: PropTypes.arrayOf(AVERAGE_SHAPE)
};

export default Log;
