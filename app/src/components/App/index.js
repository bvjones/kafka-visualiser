import React, { Component } from "react";
import openSocket from "socket.io-client";
import get from "lodash.get";
import Counter from '../Counter';
import styles from './index.module.css';

class App extends Component {
  constructor() {
    super();
    this.socket = null;

    this.state = {
      events: {}
    };

    this.incrementEventCount = this.incrementEventCount.bind(this);
  }

  incrementEventCount(eventName) {
    const event = get(this.state, `events[${eventName}]`);

    return this.setState({
      events: {
        ...this.state.events,
        [eventName]: {
          count: event ? event.count + 1 : 1
        }
      }
    });
  }

  componentWillMount() {
    this.socket = openSocket("http://localhost:3001");

    this.socket.on(
      "kafkaEvent",
      function(data) {
        const event = JSON.parse(data.value);
        const { eventName } = event.metadata;

        this.incrementEventCount(eventName);
      }.bind(this)
    );
  }

  render() {
    const counters = Object.entries(this.state.events).map(({0: name, 1: value}) => {
      return <Counter key={name} name={name} count={value.count} />
    })

    return (
      <div>
        <h1>kafka Visualiser</h1>
        <div className={styles.countersContainer}>
          {counters}
        </div>
      </div>
    );
  }
}

export default App;
