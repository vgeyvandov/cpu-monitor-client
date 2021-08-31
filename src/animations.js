import { keyframes } from 'styled-components';

export const logAlertAnimation = keyframes`
  0% {
    background-color: rgba(255, 69, 69, 0);
  }
  25% {
    background-color: rgba(255, 69, 69, .03);
  }
  50% {
    background-color: rgba(255, 69, 69, .06);
  }
  75% {
    background-color: rgba(255, 69, 69, .03);
  }
  100% {
    background-color: rgba(255, 69, 69, 0);
  }
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
