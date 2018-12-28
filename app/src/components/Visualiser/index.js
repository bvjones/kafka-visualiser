import React, { Component } from 'react';
import PropTypes from 'prop-types';
import get from 'lodash.get';
import orderBy from 'lodash.orderby';
import styles from './index.module.css';
import {
  EVENT_COUNT_TREND_INTERVAL_MS,
  EVENT_COUNT_TREND_MAX_HISTORY
} from '../../constants';

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

const maxTrendValues =
  EVENT_COUNT_TREND_MAX_HISTORY / EVENT_COUNT_TREND_INTERVAL_MS;

const startTime = Date.now();

const maxTrendHistoryMins = EVENT_COUNT_TREND_MAX_HISTORY / 60000;

export default class Visualiser extends Component {
  constructor(props) {
    super(props);
    this.state = {
      events: {},
      eventTrends: {},
      totalEventsPerSecond: 0,
      totalCount: 0
    };
    this.props = props;

    this.calculateTrends = this.calculateTrends.bind(this);

    window.setInterval(() => {
      this.calculateTrends();
    }, EVENT_COUNT_TREND_INTERVAL_MS);
  }

  calculateTrends() {
    const { eventTrends, totalCount } = this.state;
    const newEventTrends = {};
    let totalIncrement = 0;
    let newTotalCount = totalCount;

    Object.entries(this.state.events).forEach(({ 0: name, 1: value }) => {
      const previousCount = get(eventTrends, `[${name}].lastCount`) || 0;
      const increment = value.count - previousCount;
      const incrementPerSecond =
        increment / (EVENT_COUNT_TREND_INTERVAL_MS / 1000);
      totalIncrement += increment;
      newTotalCount += value.count;

      let trendValues = [...(get(eventTrends, `[${name}].trendValues`) || [])];

      trendValues.push({ x: Date.now() - startTime, y: incrementPerSecond });

      if (trendValues.length > maxTrendValues) {
        trendValues.shift();
      }

      newEventTrends[name] = {
        trendValues,
        lastCount: value.count
      };
    });

    const totalEventsPerSecond =
      totalIncrement / (EVENT_COUNT_TREND_INTERVAL_MS / 1000);

    this.setState({
      eventTrends: newEventTrends,
      totalCount: newTotalCount,
      totalEventsPerSecond
    });
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

    return { ...state, events: updatedEvents };
  }

  render() {
    const visualiserHeight = window.innerHeight - 60;
    const numberOfEvents = Object.keys(this.state.events).length;
    const { showTrends } = this.props.options;

    return (
      <div className={styles.visualiserContainer}>
        <div className={styles.eventSummaries}>
          {showTrends && (
            <span className={styles.chartLegend}>
              last {maxTrendHistoryMins} mins
            </span>
          )}
          {Object.entries(this.state.events).map(
            ({ 0: name, 1: value }, index) => {
              const topPosition =
                (visualiserHeight / (numberOfEvents + 1)) * (index + 1);

              return (
                <div
                  key={name}
                  className={styles.summary}
                  // Vertically center the event summary dependent on its height
                  style={{ top: `${topPosition - (showTrends ? 29 : 10)}px` }}
                >
                  <EventSummary
                    name={name}
                    color={value.color}
                    count={value.count}
                    showTrends={showTrends}
                    trendValues={
                      get(this.state.eventTrends, `[${name}].trendValues`) || []
                    }
                  />
                </div>
              );
            }
          )}
        </div>
        <Canvas
          events={this.state.events}
          totalCount={this.state.totalCount}
          totalEventsPerSecond={this.state.totalEventsPerSecond}
        />
      </div>
    );
  }
}

Visualiser.propTypes = {
  events: PropTypes.shape({}).isRequired,
  options: PropTypes.shape({}).isRequired
};
