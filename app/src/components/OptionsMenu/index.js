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
      optionsOpen: false,
      options: this.props.options
    };

    this.toggleOptionsMenu = this.toggleOptionsMenu.bind(this);
    this.toggleOption = this.toggleOption.bind(this);
    this.updateOptionValue = this.updateOptionValue.bind(this);
  }

  toggleOptionsMenu() {
    // If menu is closing, pass any updated options to <App/>
    if (this.state.optionsOpen) {
      this.props.updateOptions(this.state.options);
    }

    this.setState({
      optionsOpen: !this.state.optionsOpen
    });
  }

  toggleOption(changeEvent) {
    const target = changeEvent.target;
    const name = target.name;

    this.setState({
      options: {
        ...this.state.options,
        [name]: !this.state.options[name]
      }
    });
  }

  updateOptionValue(changeEvent) {
    const { name, value } = changeEvent.target;

    this.setState({
      options: {
        ...this.state.options,
        [name]: parseInt(value, 10) || 0,
      }
    });
  }

  render() {
    const { optionsOpen } = this.state;
    const { events, updateEventWhitelist } = this.props;

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
          <ConfigOptions
            options={this.state.options}
            toggleOption={this.toggleOption}
            updateOptionValue={this.updateOptionValue}
          />
        </div>
      </div>
    );
  }
}

OptionsMenu.propTypes = {
  events: PropTypes.shape({}).isRequired,
  updateEventWhitelist: PropTypes.func.isRequired,
  options: PropTypes.shape({}).isRequired,
  updateOptions: PropTypes.func.isRequired
};
