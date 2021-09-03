import PropTypes from 'prop-types';

export const SPACE_UNIT = 4;
export const FETCH_INTERVAL = 10000;

export const COLORS = {
  LIGHT_GRAY: '#dcd9d9',
  RED: '#ff4545',
  GREEN: '#63e463',
  GRAY: '#6b6b6b',
  WHITE: '#fff',
  BLACK: '#000'
};

export const AVERAGE_SHAPE = PropTypes.shape({
  id: PropTypes.string,
  value: PropTypes.number,
  createdAt: PropTypes.number,
  recoveryAlert: PropTypes.bool,
  warningAlert: PropTypes.bool
});
