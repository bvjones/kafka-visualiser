import React from 'react';
import PropTypes from 'prop-types';
import styles from './index.module.css';

export default function NumberInput({ name, onChange, displayName, value }) {
  return (
    <div className={styles.inputContainer}>
      <input
        className={styles.input}
        type="number"
        name={name}
        id={name}
        onChange={onChange}
        value={value}
        step={1000}
      />
      <label htmlFor={name} className={styles.inputLabel}>
        {displayName}
      </label>
    </div>
  );
}

NumberInput.propTypes = {
  value: PropTypes.number.isRequired,
  onChange: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired,
  displayName: PropTypes.string.isRequired
};
