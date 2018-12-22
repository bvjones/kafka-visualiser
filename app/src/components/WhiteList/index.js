import React from 'react';
import PropTypes from 'prop-types';

export default function WhiteList({ events, updateEventWhitelist }) {

  const eventSelects = Object.entries(events).map(({ 0: name, 1: value }) => {
    return (
      <div key={name}>
        <label htmlFor={name}>{name}</label>
        <input
          type="checkbox"
          name={name}
          id={name}
          checked={value.whitelisted}
          onChange={updateEventWhitelist}
        />
      </div>
    );
  });

  return <div>{eventSelects}</div>;
}

WhiteList.propTypes = {
  events: PropTypes.shape({}).isRequired,
  updateEventWhitelist: PropTypes.func.isRequired
};
