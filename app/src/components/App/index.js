import React, { Component } from 'react';
import logo from './logo.svg';
import openSocket from 'socket.io-client';
import get from 'lodash.get';
import './index.css';

class App extends Component {

  constructor() {
    super();
    this.socket = null;

    this.state = {
      events: {},
    }

    this.incrementEventCount = this.incrementEventCount.bind(this);
  }


  incrementEventCount(eventName) {
    const event = get(this.state, `events[${eventName}]`);

      return this.setState({
        events: {
          ...this.state.events,
          [eventName]: {
            count: event ? event.count + 1 : 1,
          }
        }
      })

  }
  
  componentWillMount() {
      this.socket = openSocket('http://localhost:3001');

      this.socket.on('kafkaEvent', function (data) {
      const event = JSON.parse(data.value);
      const {eventName} = event.metadata;

      console.log(eventName);
      this.incrementEventCount(eventName);
    }.bind(this));
  }

  componentDidUpdate() {
    console.log(this.state);
  }


  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Edit <code>src/App.js</code> and save to reload.
          </p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
        </header>
      </div>
    );
  }
}

export default App;
