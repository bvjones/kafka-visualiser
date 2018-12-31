import React, { Component } from 'react';
import Cookies from 'js-cookie';
import openSocket from 'socket.io-client';
import Visualiser from '../Visualiser';
import OptionsMenu from '../OptionsMenu';
import styles from './index.module.css';

import {
  EVENT_COUNT_TREND_INTERVAL_MS,
  EVENT_COUNT_TREND_MAX_HISTORY
} from '../../constants';

class App extends Component {
  constructor() {
    super();
    this.socket = null;

    const defaultOptions = {
      showTrends: false,
      eventCountTrendIntervalMs: EVENT_COUNT_TREND_INTERVAL_MS,
      eventCountTrendMaxHistoryMs: EVENT_COUNT_TREND_MAX_HISTORY
    };

    this.state = {
      events: {},
      options: Cookies.getJSON('options') || defaultOptions
    };

    this.blacklist = [];
    this.events = {};

    this.incrementEventCounts = this.incrementEventCounts.bind(this);
    this.updateEventWhitelist = this.updateEventWhitelist.bind(this);
    this.updateEventsState = this.updateEventsState.bind(this);
    this.updateOptions = this.updateOptions.bind(this);
  }

  incrementEventCounts(aggregatedEvents) {
    Object.entries(aggregatedEvents).forEach(({ 0: name, 1: value }) => {
      const existingEvent = this.events[name];

      this.events = {
        ...this.events,
        [name]: {
          count: existingEvent
            ? existingEvent.count + value.count
            : value.count,
          whitelisted: existingEvent
            ? existingEvent.whitelisted
            : !this.blacklist.includes(name)
        }
      };
    });
  }

  updateEventWhitelist(changeEvent) {
    const target = changeEvent.target;
    const name = target.name;

    const whitelisted = !this.events[name].whitelisted;

    this.events = {
      ...this.events,
      [name]: {
        ...this.events[name],
        whitelisted
      }
    };

    if (!whitelisted) {
      this.blacklist.push(name);
    } else {
      this.blacklist = this.blacklist.filter(eventName => {
        return eventName !== name;
      });
    }

    Cookies.set('blacklist', this.blacklist, { expires: 365 });
    this.updateEventsState();
  }

  updateEventsState() {
    this.setState({ events: this.events });
  }

  updateOptions(options) {
    const updatedOptions = {
      ...this.state.options,
      ...options
    };

    Cookies.set('options', updatedOptions, { expires: 365 });

    this.setState({
      options: updatedOptions
    });
  }

  componentWillMount() {
    this.blacklist = Cookies.getJSON('blacklist') || [];

    this.socket = openSocket(
      process.env.NODE_ENV === 'development'
        ? 'http://localhost:3001'
        : window.location.origin
    );

    this.socket.on(
      'kafkaEvents',
      function(aggregatedEvents) {
        this.incrementEventCounts(aggregatedEvents);
        this.updateEventsState();
      }.bind(this)
    );
  }

  render() {
    const { events, options } = this.state;

    return (
      <div>
        <h1 className={styles.title}>kafka Visualiser</h1>
        <Visualiser events={events} options={options} />
        <OptionsMenu
          events={events}
          updateEventWhitelist={this.updateEventWhitelist}
          options={options}
          updateOptions={this.updateOptions}
        />
      </div>
    );
  }
}

export default App;
