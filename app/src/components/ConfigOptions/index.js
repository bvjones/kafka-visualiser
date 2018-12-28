import React from 'react';
import PropTypes from 'prop-types';
import CheckBox from '../CheckBox';
import NumberInput from '../NumberInput';
import styles from './index.module.css';

export default function ConfigOptions({options, toggleOption, updateOptionValue}) {
  return (
    <div className={styles.configContainer}>
       <h2 className={styles.title}>display options</h2>
      <CheckBox
        name={'showTrends'}
        checked={options.showTrends}
        onChange={toggleOption}
        displayName={"Show Trend Graphs"}
      />
      <NumberInput 
        name={'eventCountTrendIntervalMs'}
        onChange={updateOptionValue}
        displayName={"Events Per Second Calculation Interval (ms)"}
        updateOptionValue={updateOptionValue}
        value={options.eventCountTrendIntervalMs}
      />
      <p className={styles.infoText}>
        How often the app re-calculates the number of each event per second and updates the UI. Setting this to a low value will affect performance. Recommended value: at least 10000 (10 seconds).
      </p>
       <NumberInput 
        name={'eventCountTrendMaxHistoryMs'}
        onChange={updateOptionValue}
        displayName={"Max Trend History (ms)"}
        updateOptionValue={updateOptionValue}
        value={options.eventCountTrendMaxHistoryMs}
      />
       <p className={styles.infoText}>
        The maximum length of time to display on the events per second trend graphs. Making this number too large will affect performance. Recommended value: 900000 (15 minutes).
      </p>
    </div>
  );
}

ConfigOptions.propTypes = {
  options: PropTypes.shape({}).isRequired,
  toggleOption: PropTypes.func.isRequired,
  updateOptionValue: PropTypes.func.isRequired,
};
