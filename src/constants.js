import PropTypes from 'prop-types';

export const SPACE_UNIT = 4;
export const FETCH_INTERVAL = 10000;
export const GRAPH_MAX = 20;

export const BORDER_LINE_COLOR = '#dcd9d9';
export const LIMIT_COLOR = '#ff4545';
export const HEALTH_COLOR = '#63e463';

export const AVERAGE_SHAPE = PropTypes.shape({
  id: PropTypes.string,
  value: PropTypes.number,
  createdAt: PropTypes.number,
  limitCleared: PropTypes.bool,
  limitReached: PropTypes.bool
});
