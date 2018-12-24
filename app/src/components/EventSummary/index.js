import React from "react";
import PropTypes from 'prop-types';
import styles from './index.module.css';
import numeral from 'numeral';


export default function EventSummary({ name, count, color }) {
  const displayCount = count < 1000 ? count : numeral(count).format('0.0a');

  return (
    <div className={styles.eventSummaryContainer}>
      <span className={styles.count} style={{color: color}}>{displayCount}</span>
      <span className={styles.name}>{name}</span>
    </div>
  );
}

EventSummary.propTypes = {
  name: PropTypes.string.isRequired,
  count: PropTypes.number.isRequired,
}