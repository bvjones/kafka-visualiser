import React, { Component } from 'react';
import openSocket from 'socket.io-client';
import Counter from '../Counter';
import Visualiser from '../Visualiser';
import Options from '../Options';
import styles from './index.module.css';

class App extends Component {
  constructor() {
    super();
    this.socket = null;

    this.state = {
      events: {}
    };

    this.events = {};

    this.incrementEventCounts = this.incrementEventCounts.bind(this);
    this.updateEventWhitelist = this.updateEventWhitelist.bind(this);
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
    const { events } = this.state;

    // const counters = Object.entries(events).map(({ 0: name, 1: value }) => {
    //   return <Counter key={name} name={name} count={value.count} />;
    // });

    return (
      <div>
        <h1 className={styles.title}>kafka Visualiser</h1>
        <Visualiser events={events} />
        {/* <div className={styles.countersContainer}>{counters}</div> */}
        <Options
          events={events}
          updateEventWhitelist={this.updateEventWhitelist}
          updateEventsState={this.updateEventsState}
        />
      </div>
    );
  }
}

export default App;
