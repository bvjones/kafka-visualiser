import React from "react";
import PropTypes from 'prop-types';
import styles from './index.module.css';
import ColorHash from "color-hash";
import numeral from 'numeral';

const colorHash = new ColorHash();

export default function Counter({ name, count }) {
  const displayCount = count < 1000 ? count : numeral(count).format('0.0a');

  return (
    <div className={styles.counterContainer}>
      <span className={styles.count} style={{color: colorHash.hex(name)}}>{displayCount}</span>
      <span className={styles.name}>{name}</span>
    </div>
  );
}

Counter.propTypes = {
  name: PropTypes.string.isRequired,
  count: PropTypes.number.isRequired,
}