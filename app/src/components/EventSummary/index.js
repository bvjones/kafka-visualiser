import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import styles from './index.module.css';
import TrendChart from '../TrendChart';
import formatDisplayNumber from '../../utils/formatDisplayNumber';

export default function EventSummary({
  name,
  count,
  color,
  trendValues,
  showTrends
}) {
  const displayCount = formatDisplayNumber(count);

  const perSecondCount =
    trendValues.length > 0 ? trendValues[trendValues.length - 1].y : 0;
  const displayPerSecondCount = formatDisplayNumber(perSecondCount);

  return (
    <div className={styles.eventSummaryContainer}>
      {showTrends && (
        <Fragment>
          <TrendChart trendValues={trendValues} color={color} />
          <span style={{ color: color }} className={styles.perSecondCount}>
            {displayPerSecondCount}/s
          </span>
        </Fragment>
      )}
      <div
        className={`${styles.nameContainer} ${
          showTrends ? styles.nameContainerWithTrends : null
        }`}
      >
        <span
          className={`${styles.name} ${
            showTrends ? styles.nameWithTrends : null
          }`}
        >
          {name}
        </span>
        <span
          className={`${styles.count} ${
            showTrends ? styles.countWithTrends : null
          }`}
          style={{ color: color }}
        >
          {displayCount}
        </span>
      </div>
    </div>
  );
}

EventSummary.propTypes = {
  name: PropTypes.string.isRequired,
  count: PropTypes.number.isRequired,
  trendValues: PropTypes.arrayOf(PropTypes.shape({})),
  showTrends: PropTypes.bool.isRequired
};

EventSummary.defaultProps = {
  trendValues: []
};
