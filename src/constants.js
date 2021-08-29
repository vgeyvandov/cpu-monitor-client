import PropTypes from 'prop-types';

export const SPACE_UNIT = 4;
export const FETCH_INTERVAL = 10000;

export const AVERAGE_SHAPE = PropTypes.shape({
  id: PropTypes.string,
  value: PropTypes.number,
  createdAt: PropTypes.number
});
