import React, { Component } from "react";
import PropTypes from 'prop-types';
import get from "lodash.get";

import Canvas from '../Canvas';

export default class Visualiser extends Component {
  constructor(props) {
    super(props);
    this.state = { events: {

    }
  };
    this.updateAnimationState = this.updateAnimationState.bind(this);
  }

  componentDidMount() {
    this.rAF = requestAnimationFrame(this.updateAnimationState);
  }

  static getDerivedStateFromProps(props, state) {
    let newState = { ...state }

    Object.entries(props.events).forEach(({0: name, 1: value}) => {
      newState.events[name] = {
        count: value.count,
        increment: value.count - get(state, `events[${name}].count`) || 0,
      }
    })

    return { events: newState.events };
  }

  updateAnimationState() {
    this.setState(prevState => ({ angle: prevState.angle + 1 }));
    this.rAF = requestAnimationFrame(this.updateAnimationState);
  }

  componentWillUnmount() {
    cancelAnimationFrame(this.rAF);
  }

  render() {
    return <Canvas angle={this.state.angle} />;
  }
}

Visualiser.propTypes = {
  events: PropTypes.shape({}).isRequired,
}
