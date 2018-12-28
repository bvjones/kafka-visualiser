import React, { Component } from 'react';
import openSocket from 'socket.io-client';
import Visualiser from '../Visualiser';
import OptionsMenu from '../OptionsMenu';
import styles from './index.module.css';

class App extends Component {
  constructor() {
    super();
    this.socket = null;

    this.state = {
      events: {},
      options: {
        showTrends: true
      }
    };

    this.events = {};

    this.incrementEventCounts = this.incrementEventCounts.bind(this);
    this.updateEventWhitelist = this.updateEventWhitelist.bind(this);
    this.toggleOption = this.toggleOption.bind(this);
    this.updateEventsState = this.updateEventsState.bind(this);
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
          whitelisted: existingEvent ? existingEvent.whitelisted : true
        }
      };
    });
  }

  updateEventWhitelist(changeEvent) {
    const target = changeEvent.target;
    const name = target.name;

    this.events = {
      ...this.events,
      [name]: {
        ...this.events[name],
        whitelisted: !this.events[name].whitelisted
      }
    };
  }

  updateEventsState() {
    this.setState({ events: this.events });
  }

  toggleOption(changeEvent) {
    const target = changeEvent.target;
    const name = target.name;

    this.setState({
      options: {
        ...this.state.options,
        [name]: !this.state.options[name],
      }
    })
  }

  componentWillMount() {
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
          toggleOption={this.toggleOption}
        />
      </div>
    );
  }
}

export default App;
