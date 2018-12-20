import React, { Component } from "react";
import openSocket from "socket.io-client";
import Counter from "../Counter";
import Visualiser from "../Visualiser";
import styles from "./index.module.css";

class App extends Component {
  constructor() {
    super();
    this.socket = null;

    this.state = {
      events: {}
    };

    this.events = {};

    this.incrementEventCounts = this.incrementEventCounts.bind(this);
  }

  incrementEventCounts(aggregatedEvents) {
    Object.entries(aggregatedEvents).forEach(({0: name, 1: value}) => {
      this.events = {
        ...this.events,
        [name]: {
          count: this.events[name] ? this.events[name].count + value.count : value.count,
        }
      }
    })
  }

  updateEventsState() {
    this.setState({ events: this.events });
  }

  componentWillMount() {
    this.socket = openSocket(process.env.NODE_ENV === 'development' ? "http://localhost:3001" : window.location.origin);

    this.socket.on(
      "kafkaEvents",
      function(aggregatedEvents) {
        this.incrementEventCounts(aggregatedEvents);
        this.updateEventsState();
      }.bind(this)
    );
  }

  render() {
    const counters = Object.entries(this.state.events).map(
      ({ 0: name, 1: value }) => {
        return <Counter key={name} name={name} count={value.count} />;
      }
    );

    return (
      <div>
        <h1 className={styles.title}>kafka Visualiser</h1>
        <Visualiser events={this.state.events} />
        <div className={styles.countersContainer}>{counters}</div>
      </div>
    );
  }
}

export default App;
