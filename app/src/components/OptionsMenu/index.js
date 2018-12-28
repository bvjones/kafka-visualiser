import React, { Component } from 'react';
import PropTypes from 'prop-types';
import CogIcon from '../CogIcon';
import WhiteList from '../WhiteList';
import ConfigOptions from '../ConfigOptions';
import styles from './index.module.css';

export default class OptionsMenu extends Component {
  constructor(props) {
    super(props);

    this.props = props;
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
    const { optionsOpen } = this.state;
    const { events, options, updateEventWhitelist, toggleOption } = this.props;

    return (
      <div>
        <button
          className={`${styles.toggleOptions} ${
            optionsOpen ? styles.rotateButton : null
          }`}
          onClick={this.toggleOptionsMenu}
        >
          <CogIcon />
        </button>
        <div
          className={`${styles.optionsMenu} ${
            optionsOpen ? styles.menuUp : null
          }`}
        >
          <WhiteList
            events={events}
            updateEventWhitelist={updateEventWhitelist}
          />
          <ConfigOptions options={options} toggleOption={toggleOption} />
        </div>
      </div>
    );
  }
}

OptionsMenu.propTypes = {
  events: PropTypes.shape({}).isRequired,
  updateEventWhitelist: PropTypes.func.isRequired,
  options: PropTypes.shape({}).isRequired,
  toggleOption: PropTypes.func.isRequired
};
