import React from 'react';
import PropTypes from 'prop-types';
import styles from './index.module.css';

export default function WhiteList({ events, updateEventWhitelist }) {

  const eventSelects = Object.entries(events).map(({ 0: name, 1: value }) => {
    return (
      <div key={name} className={styles.checkboxContainer}>
        <input
          className={styles.checkbox}
          type="checkbox"
          name={name}
          id={name}
          checked={value.whitelisted}
          onChange={updateEventWhitelist}
        />
        <label htmlFor={name} className={styles.checkboxLabel}>{name}</label>
      </div>
    );
  });

  return <div>{eventSelects}</div>;
}

WhiteList.propTypes = {
  events: PropTypes.shape({}).isRequired,
  updateEventWhitelist: PropTypes.func.isRequired
};
