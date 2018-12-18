import React from "react";
import PropTypes from 'prop-types';
import styles from './index.module.css';

export default function Counter({ name, count }) {
  return (
    <div className={styles.counterContainer}>
      <span className={styles.count}>{count}</span>
      <span className={styles.name}>{name}</span>
    </div>
  );
}

Counter.propTypes = {
  name: PropTypes.string.isRequired,
  count: PropTypes.number.isRequired,
}