import React, { useEffect, useState } from 'react';
import styled, { css, keyframes } from 'styled-components';
import update from 'immutability-helper';

const Container = styled.div`
  height: 400px;
  width: calc(100% - 16px);
  padding: 8px;
  position: relative;
  overflow: hidden;
`;

const GraphOutline = styled.div`
  height: calc(100% - 16px);
  width: calc(100% - 16px);
  border: 1px solid #eee;
  position: absolute;
`;

const GraphHorizontalMark = styled.hr`
  height: 1px;
  border-width: 0;
  color: #eee;
  background-color: #eee;
  position: absolute;
  top: ${(props) => props.top}%;
  width: 100%;
  margin: 0;
`;

const GraphVerticalMark = styled.div`
  position: absolute;
  left: ${(props) => props.left}%;
  border-left: 1px dashed #eee;
  height: 100%;
`;

const BarsContainer = styled.div`
  height: calc(100% - 15px);
  width: calc(100% - 16px);
  position: absolute;
`;

const Bar = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: ${(props) => props.heightValue}%;
  width: calc(100% / 120);
  margin: 0 2px;
  background-color: white;
  position: absolute;
  bottom: 0;
  left: 0;
  transition: transform, height 0.2s ease-out;
  transform: ${(props) => `translateX(calc(200% * ${props.index}))`};
`;

const pulseAnimation = keyframes`
  0% {
    -moz-box-shadow: 0 0 0 0 rgba(255, 0, 0, 0.4);
    box-shadow: 0 0 0 0 rgba(255, 0, 0, 0.4);
  }
  70% {
      -moz-box-shadow: 0 0 0 10px rgba(255, 0, 0, 0);
      box-shadow: 0 0 0 10px rgba(255, 0, 0, 0);
  }
  100% {
      -moz-box-shadow: 0 0 0 0 rgba(255, 0, 0, 0);
      box-shadow: 0 0 0 0 rgba(255, 0, 0, 0);
  }
`;

const Fill = styled.div`
  height: 100%;
  width: 70%;
  background-color: red;
  border-top-right-radius: 2px;
  border-top-left-radius: 2px;

  ${(props) =>
    props.isWaiting
      ? css`
          width: 25%;
          min-height: 4px;
          border-radius: 50%;
          animation: ${pulseAnimation} 1.5s infinite;
        `
      : ''}
`;

function getNewAverage() {
  return { value: 0, createdAt: Date.now() };
}

function updateAverages(averages, average) {
  const updatedAverages = update(averages, {
    [averages.length - 1]: { value: { $set: average.value } },
    $push: [getNewAverage()]
  });

  if (updatedAverages.length > 60) {
    return update(updatedAverages, { $splice: [[0, 1]] });
  }

  return updatedAverages;
}

function App() {
  const [cpuCount, setCpuCount] = useState(0);
  const [cpuAverages, setCpuAverages] = useState([getNewAverage()]);

  useEffect(async () => {
    const response = await fetch('http://localhost:3001/cpu-count');
    const { value } = await response.json();
    setCpuCount(value);
  }, [setCpuCount]);

  useEffect(() => {
    async function fetchAverage() {
      const response = await fetch('http://localhost:3001/cpu-average');
      const average = await response.json();
      setCpuAverages((averages) => updateAverages(averages, average));
    }

    fetchAverage();

    setInterval(fetchAverage, 10000);
  }, [setCpuAverages]);

  return (
    <Container>
      <GraphOutline>
        <GraphHorizontalMark top="25" />
        <GraphHorizontalMark top="50" />
        <GraphHorizontalMark top="75" />

        <GraphVerticalMark left="25" />
        <GraphVerticalMark left="50" />
        <GraphVerticalMark left="75" />
      </GraphOutline>

      <BarsContainer>
        {cpuAverages.map(({ value, createdAt }, index) => (
          <Bar
            key={createdAt}
            heightValue={(value / (cpuCount * 2)) * 100}
            index={index}
          >
            <Fill isWaiting={value === 0} />
          </Bar>
        ))}
      </BarsContainer>
    </Container>
  );
}

export default App;
