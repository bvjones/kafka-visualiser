import React, { Component } from 'react';
import PropTypes from 'prop-types';
import get from 'lodash.get';
import orderBy from 'lodash.orderby';
import styles from './index.module.css';

import Canvas from '../Canvas';
import EventSummary from '../EventSummary';

const colorPalette = ['#13a8fe', '#ff00ff', '#ffa300', '#cf0060'];

let colors = [];

const getNextColor = () => {
  if (colors.length === 0) {
    colors = [...colorPalette];
  }

  return colors.pop();
};

export default class Visualiser extends Component {
  constructor(props) {
    super(props);
    this.state = { events: {} };
  }

  static getDerivedStateFromProps(props, state) {
    let updatedEvents = {};

    let whitelistedEvents = Object.entries(props.events).filter(
      ({ 1: value }) => {
        return value.whitelisted;
      }
    );

    // Sort events by name in alphabetical asc order
    whitelistedEvents = orderBy(whitelistedEvents, ['0']);

    whitelistedEvents.forEach(({ 0: name, 1: value }) => {
      updatedEvents[name] = {
        ...value,
        count: value.count,
        increment: value.count - get(state, `events[${name}].count`) || 0,
        color: get(state, `events[${name}].color`) || getNextColor()
      };
    });

    return { events: updatedEvents };
  }

  render() {
    return (
      <div className={styles.visualiserContainer}>
        <div className={styles.eventSummaries}>
          {Object.entries(this.state.events).map(({0: name, 1: value}) => {
            return (
             <EventSummary name={name} color={value.color} count={value.count} />
            );
          })}
        </div>
        <Canvas events={this.state.events} />
      </div>
    );
  }
}

Visualiser.propTypes = {
  events: PropTypes.shape({}).isRequired
};
