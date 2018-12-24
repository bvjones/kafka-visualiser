import React from 'react';
import PropTypes from 'prop-types';
import styles from './index.module.css';
import TrendChart from '../TrendChart';
import numeral from 'numeral';

export default function EventSummary({ name, count, color, trendValues }) {
  const displayCount = count < 1000 ? count : numeral(count).format('0.0a');

  const perSecondCount =
    trendValues.length > 0 ? trendValues[trendValues.length - 1].y : 0;
  const displayPerSecondCount =
    perSecondCount < 1000
      ? perSecondCount
      : numeral(perSecondCount).format('0.0a');

  return (
    <div className={styles.eventSummaryContainer}>
      <TrendChart trendValues={trendValues} color={color} />
      <span style={{ color: color }} className={styles.perSecondCount}>{displayPerSecondCount}/s</span>
      <div>
        <span className={styles.name}>{name}</span>
        <span className={styles.count} style={{ color: color }}>
          {displayCount}
        </span>
      </div>
    </div>
  );
}

EventSummary.propTypes = {
  name: PropTypes.string.isRequired,
  count: PropTypes.number.isRequired,
  trendValues: PropTypes.arrayOf(PropTypes.shape({}))
};

EventSummary.defaultProps = {
  trendValues: []
};
