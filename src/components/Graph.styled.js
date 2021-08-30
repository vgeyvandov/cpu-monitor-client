import styled, { css, keyframes } from 'styled-components';
import {
  BORDER_LINE_COLOR,
  HEALTH_COLOR,
  LIMIT_COLOR,
  SPACE_UNIT
} from '../constants';

export const GraphContainer = styled.div`
  height: 400px;
  width: 100%;
  margin-bottom: ${SPACE_UNIT * 8}px;
  position: relative;
`;

export const GraphOutline = styled.div`
  height: calc(100% - ${SPACE_UNIT * 8}px);
  width: 100%;
  border: 1px solid ${BORDER_LINE_COLOR};
  position: absolute;
  border-radius: 4px;
`;

export const GraphHorizontalMark = styled.hr`
  height: 1px;
  border-width: 0;
  color: ${BORDER_LINE_COLOR};
  background-color: ${props =>
    props.isThresholdLine ? 'rgba(255, 69, 69, 0.2)' : `${BORDER_LINE_COLOR}`};
  position: absolute;
  top: ${props => props.top}%;
  width: 100%;
  margin: 0;
`;

export const GraphVerticalMark = styled.div`
  position: absolute;
  left: ${props => props.left}%;
  border-left: 1px dashed ${BORDER_LINE_COLOR};
  height: 100%;
`;

export const MinMark = styled.div`
  position: absolute;
  font-size: 12px;
  color: #6b6b6b;

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
  color: #6b6b6b;
`;

export const MaxMark = styled.div`
  position: absolute;
  font-size: 12px;
  color: #6b6b6b;

  ${props =>
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
  background-color: white;
  position: absolute;
  bottom: 0;
  left: 0;
  transition: height 0.5s ease-out;
`;

export const warningAnimation = keyframes`
  0% {
    box-shadow: 0 0 0 0 rgba(255, 69, 69, 0.4);
  }
  70% {
    box-shadow: 0 0 0 10px rgba(255, 69, 69, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(255, 69, 69, 0);
  }
`;

export const healthyAnimation = keyframes`
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

export const Fill = styled.div`
  height: 100%;
  width: 70%;
  background-color: ${props =>
    props.isOverThreshold ? LIMIT_COLOR : HEALTH_COLOR};
  border-top-right-radius: 2px;
  border-top-left-radius: 2px;

  ${props =>
    props.isWaiting
      ? css`
          width: 25%;
          min-height: 4px;
          border-radius: 50%;
          background-color: ${props =>
            props.isHealthy ? HEALTH_COLOR : LIMIT_COLOR};
          animation: ${props.isHealthy ? healthyAnimation : warningAnimation} 1s
            infinite;
        `
      : ''}
`;

export const Alert = styled.div`
  display: ${props =>
    props.limitCleared || props.limitReached ? 'block' : 'none'};
  position: absolute;
  top: -${SPACE_UNIT * 2}px;
  right: 0;
  height: 8px;
  width: 8px;
  background-color: ${props =>
    props.limitReached ? LIMIT_COLOR : HEALTH_COLOR};
`;
