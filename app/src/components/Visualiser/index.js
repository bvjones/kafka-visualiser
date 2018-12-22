import React, { Component } from "react";
import PropTypes from "prop-types";
import get from "lodash.get";
import ColorHash from "color-hash";

import Canvas from "../Canvas";

const colorHash = new ColorHash();

export default class Visualiser extends Component {
  constructor(props) {
    super(props);
    this.state = { events: {} };
  }

  static getDerivedStateFromProps(props, state) {
    let updatedEvents = {};

    const whitelistedEvents = Object.entries(props.events).filter(({1: value}) => {
      return value.whitelisted;
    })

    whitelistedEvents.forEach(({ 0: name, 1: value }) => {
      updatedEvents[name] = {
        ...value,
        count: value.count,
        increment: value.count - get(state, `events[${name}].count`) || 0,
        color: get(state, `events[${name}].color`) || colorHash.hex(name)
      };
    });

    return { events: updatedEvents };
  }

  render() {
    return <Canvas events={this.state.events} />;
  }
}

Visualiser.propTypes = {
  events: PropTypes.shape({}).isRequired
};
