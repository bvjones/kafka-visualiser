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
    let newState = { ...state };

    Object.entries(props.events).forEach(({ 0: name, 1: value }) => {
      newState.events[name] = {
        count: value.count,
        increment: value.count - get(state, `events[${name}].count`) || 0,
        color: get(state, `events[${name}].color`) || colorHash.hex(name)
      };
    });

    return { events: newState.events };
  }

  render() {
    return <Canvas events={this.state.events} />;
  }
}

Visualiser.propTypes = {
  events: PropTypes.shape({}).isRequired
};
