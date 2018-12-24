import React, { Component } from 'react';
import {
  EVENT_COUNT_TREND_MAX_HISTORY,
  EVENT_COUNT_TREND_INTERVAL_MS
} from '../../constants';
import PropTypes from 'prop-types';

const maxEventPoints =
  EVENT_COUNT_TREND_MAX_HISTORY / EVENT_COUNT_TREND_INTERVAL_MS;

export default class TrendChart extends Component {
  constructor(props) {
    super();
    this.props = props;

    this.canvasRef = React.createRef();
    this.updateAnimationState = this.updateAnimationState.bind(this);
    this.lastDrawnPoint = null;
  }

  shouldComponentUpdate(nextProps, nextState) {
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
    const { trendValues } = this.props;
    const canvas = this.canvasRef.current;
    const brush = canvas.getContext('2d');

    brush.clearRect(0, 0, canvas.width, canvas.height);

    brush.lineWidth = 2;

    brush.beginPath();
    brush.moveTo(1, 1);
    brush.lineTo(1, canvas.height - 1);
    brush.lineTo(canvas.width, canvas.height - 1);
    brush.strokeStyle = this.props.color;
    brush.stroke();

    const pointSpacing = (canvas.width - 1) / maxEventPoints;

    const maxHeight = canvas.height * 0.9;
    const heightOffSet = canvas.height - maxHeight;

    const maxY = trendValues.reduce((maxY, trendValue) => {
      if (trendValue.y > maxY) {
        return trendValue.y;
      }
      return maxY;
    }, 0);

    console.log('*****NEW DRAW*****');

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
    return <canvas width={120} height={60} ref={this.canvasRef} />;
  }
}

TrendChart.propTypes = {
  trendValues: PropTypes.arrayOf(PropTypes.shape({}))
};

TrendChart.defaultProps = {
  trendValues: []
};
