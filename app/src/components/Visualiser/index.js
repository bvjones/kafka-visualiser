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

const startTime = Date.now();

export default class Visualiser extends Component {
  constructor(props) {
    super(props);
    this.props = props;
    const {
      eventCountTrendIntervalMs,
      eventCountTrendMaxHistoryMs
    } = this.props.options;

    const maxTrendValues =
      eventCountTrendMaxHistoryMs / eventCountTrendIntervalMs;

    const maxTrendHistoryMins = eventCountTrendMaxHistoryMs / 60000;

    this.calculateTrends = this.calculateTrends.bind(this);

    this.calculationInterval = window.setInterval(() => {
      this.calculateTrends();
    }, eventCountTrendIntervalMs);

    this.state = {
      events: {},
      eventTrends: {},
      totalEventsPerSecond: 0,
      totalCount: 0,
      maxTrendValues,
      maxTrendHistoryMins,
      eventCountTrendIntervalMs
    };
  }

  calculateTrends() {
    const { eventTrends, maxTrendValues } = this.state;
    const newEventTrends = {};
    let totalIncrement = 0;
    let newTotalCount = 0;
    const { eventCountTrendIntervalMs } = this.props.options;

    Object.entries(this.state.events).forEach(({ 0: name, 1: value }) => {
      const previousCount = get(eventTrends, `[${name}].lastCount`) || 0;
      const increment = value.count - previousCount;
      const incrementPerSecond = increment / (eventCountTrendIntervalMs / 1000);
      totalIncrement += increment;
      newTotalCount += value.count;

      let trendValues = [...(get(eventTrends, `[${name}].trendValues`) || [])];

      trendValues.push({ x: Date.now() - startTime, y: incrementPerSecond });

      if (trendValues.length > maxTrendValues) {
        const valuesToRemove = trendValues.length - maxTrendValues;
        trendValues.splice(0, valuesToRemove);
      }

      newEventTrends[name] = {
        trendValues,
        lastCount: value.count
      };
    });

    const totalEventsPerSecond =
      totalIncrement / (eventCountTrendIntervalMs / 1000);

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

    const {
      eventCountTrendIntervalMs,
      eventCountTrendMaxHistoryMs
    } = props.options;

    const maxTrendValues =
      eventCountTrendMaxHistoryMs / eventCountTrendIntervalMs;

    const maxTrendHistoryMins = eventCountTrendMaxHistoryMs / 60000;

    return {
      ...state,
      events: updatedEvents,
      maxTrendHistoryMins,
      maxTrendValues
    };
  }

  componentDidUpdate(prevProps) {
    // If event trend interval has been updated
    if (
      prevProps.options.eventCountTrendIntervalMs !==
      this.props.options.eventCountTrendIntervalMs
    ) {
      window.clearInterval(this.calculationInterval);

      this.calculationInterval = window.setInterval(() => {
        this.calculateTrends();
      }, this.props.options.eventCountTrendIntervalMs);
    }
  }

  render() {
    const visualiserHeight = window.innerHeight - 60;
    const numberOfEvents = Object.keys(this.state.events).length;
    const { showTrends } = this.props.options;
    const {
      maxTrendValues,
      maxTrendHistoryMins,
      events,
      eventTrends,
      totalCount,
      totalEventsPerSecond
    } = this.state;

    return (
      <div className={styles.visualiserContainer}>
        <div className={styles.eventSummaries}>
          {showTrends && (
            <span className={styles.chartLegend}>
              last {maxTrendHistoryMins} mins
            </span>
          )}
          {Object.entries(events).map(({ 0: name, 1: value }, index) => {
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
                  maxTrendValues={maxTrendValues}
                  trendValues={get(eventTrends, `[${name}].trendValues`) || []}
                />
              </div>
            );
          })}
        </div>
        <Canvas
          events={events}
          totalCount={totalCount}
          totalEventsPerSecond={totalEventsPerSecond}
        />
      </div>
    );
  }
}

Visualiser.propTypes = {
  events: PropTypes.shape({}).isRequired,
  options: PropTypes.shape({}).isRequired
};
