import styled, { css } from 'styled-components';
import { COLORS, SPACE_UNIT } from '../constants';
import { healthyAnimation, warningAnimation } from '../animations';

export const GraphContainer = styled.div`
  height: 400px;
  width: 100%;
  margin-bottom: ${SPACE_UNIT * 8}px;
  position: relative;
`;

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
            props.isHealthy ? COLORS.GREEN : COLORS.RED};
          animation: ${props.isHealthy ? healthyAnimation : warningAnimation} 1s
            infinite;
        `
      : ''}
`;

export const Alert = styled.div`
  position: absolute;
  font-size: 12px;
  top: -${SPACE_UNIT * 3}px;
  cursor: default;
  color: ${props => (props.limitReached ? COLORS.RED : COLORS.GREEN)};

  @media only screen and (min-width: 620px) {
    top: -${SPACE_UNIT * 6}px;
    font-size: 24px;
  }
`;

export const MaxInput = styled.input`
  width: 36px;
`;
