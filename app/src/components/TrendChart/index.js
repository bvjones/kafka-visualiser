import React, { Component } from 'react';
import PropTypes from 'prop-types';
import formatDisplayNumber from '../../utils/formatDisplayNumber';
import styles from './index.module.css';

export default class TrendChart extends Component {
  constructor(props) {
    super();
    this.props = props;

    this.canvasRef = React.createRef();
    this.updateAnimationState = this.updateAnimationState.bind(this);
    this.lastDrawnPoint = null;
  }

  shouldComponentUpdate(nextProps) {
    const { trendValues } = nextProps;

    if (
      trendValues.length > 0 &&
      trendValues[trendValues.length - 1].x !== this.lastDrawnPoint
    ) {
      this.updateAnimationState();
      this.lastDrawnPoint = trendValues[trendValues.length - 1].x;
      return true;
    }

    return false;
  }

  updateAnimationState() {
    const { trendValues, maxTrendValues } = this.props;
    const canvas = this.canvasRef.current;
    const brush = canvas.getContext('2d');

    brush.clearRect(0, 0, canvas.width, canvas.height);

    brush.lineWidth = 1.3;

    brush.beginPath();
    brush.moveTo(1, 1);
    brush.lineTo(1, canvas.height - 1);
    brush.lineTo(canvas.width, canvas.height - 1);
    brush.strokeStyle = this.props.color;
    brush.stroke();

    const maxY = trendValues.reduce((maxY, trendValue) => {
      if (trendValue.y > maxY) {
        return trendValue.y;
      }
      return maxY;
    }, 0);

    this.maxY = maxY;

    const pointSpacing = (canvas.width - 1) / maxTrendValues;

    const maxHeight = canvas.height * 0.9;
    const heightOffSet = canvas.height - maxHeight;

    if (trendValues.length > 0) {
      let pointX = 2;

      brush.beginPath();
      brush.moveTo(
        pointX,
        maxHeight - (trendValues[0].y / maxY) * maxHeight + heightOffSet
      );
      trendValues.slice(0).forEach(trendValue => {
        pointX += pointSpacing;
        const pointY =
          maxHeight - (trendValue.y / maxY) * maxHeight + heightOffSet;
        brush.lineTo(pointX, pointY);
      });

      brush.strokeStyle = this.props.color;
      brush.stroke();
    }
  }

  render() {
    const displayMaxY = formatDisplayNumber(this.maxY);

    return (
      <div className={styles.chartContainer}>
        <span
          className={styles.chartYLabel}
          style={{ color: this.props.color }}
        >
          {this.props.trendValues.length > 1 && displayMaxY}
        </span>
        <canvas width={120} height={45} ref={this.canvasRef} />
      </div>
    );
  }
}

TrendChart.propTypes = {
  trendValues: PropTypes.arrayOf(PropTypes.shape({})),
  maxTrendValues: PropTypes.number.isRequired,
};

TrendChart.defaultProps = {
  trendValues: []
};
