import React, { Component } from "react";
import CogIcon from "../CogIcon";
import styles from "./index.module.css";

export default class Options extends Component {
  constructor() {
    super();
    this.state = {
      optionsOpen: false
    };

    this.toggleOptionsMenu = this.toggleOptionsMenu.bind(this);
  }

  toggleOptionsMenu() {
    this.setState({
      optionsOpen: !this.state.optionsOpen
    });
  }

  render() {
    const {optionsOpen} = this.state;

    return (
      <div>
        <button
          className={`${styles.toggleOptions} ${optionsOpen ? styles.rotateButton : null}`}
          onClick={this.toggleOptionsMenu}
        >
          <CogIcon />
        </button>
        <div className={`${styles.optionsMenu} ${optionsOpen ? styles.menuUp : null}`}>Options</div>
      </div>
    );
  }
}
