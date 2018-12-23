import React from 'react';
import PropTypes from 'prop-types';
import CheckMark from '../CheckMark';
import styles from './index.module.css';

export default function WhiteList({ events, updateEventWhitelist }) {
  const eventSelects = Object.entries(events).map(({ 0: name, 1: value }) => {
    const { whitelisted } = value;

    return (
      <div key={name} className={styles.checkboxContainer}>
        <input
          className={styles.input}
          type="checkbox"
          name={name}
          id={name}
          checked={whitelisted}
          onChange={updateEventWhitelist}
        />
        <label
          htmlFor={name}
          className={styles.checkboxLabel}
          checked={whitelisted}
        >
          <div className={styles.checkbox}>{whitelisted && <CheckMark />}</div>
          {name}
        </label>
      </div>
    );
  });

  return (
    <div className={styles.whitelistContainer}>
      <h2 className={styles.title}>events Whitelist</h2>
      <div className={styles.eventsContainer}>{eventSelects}</div>
    </div>
  );
}

WhiteList.propTypes = {
  events: PropTypes.shape({}).isRequired,
  updateEventWhitelist: PropTypes.func.isRequired
};
