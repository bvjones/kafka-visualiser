import React from 'react';
import PropTypes from 'prop-types';
import CheckBox from '../CheckBox';
import styles from './index.module.css';

export default function ConfigOptions({options, toggleOption}) {
  return (
    <div className={styles.configContainer}>
       <h2 className={styles.title}>display options</h2>
      <CheckBox
        name={'showTrends'}
        checked={options.showTrends}
        onChange={toggleOption}
        displayName={"Show Trend Graphs"}
      />
    </div>
  );
}

ConfigOptions.propTypes = {
  options: PropTypes.shape({}).isRequired,
  toggleOption: PropTypes.func.isRequired
};
