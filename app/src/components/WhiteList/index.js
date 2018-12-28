import React from 'react';
import PropTypes from 'prop-types';
import CheckBox from '../CheckBox';
import orderBy from 'lodash.orderby';
import styles from './index.module.css';

export default function WhiteList({ events, updateEventWhitelist }) {
  const eventObjects = Object.entries(events);
  const sortedEvents = orderBy(eventObjects, ['0']); 

  const eventSelects = sortedEvents.map(({ 0: name, 1: value }) => {
    const { whitelisted } = value;

    return (
      <CheckBox
        checked={whitelisted}
        onChange={updateEventWhitelist}
        name={name}
        key={name}
        displayName={name}
      />
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
