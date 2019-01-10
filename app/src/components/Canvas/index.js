import React, { Component } from 'react';
import PropTypes from 'prop-types';
import formatDisplayNumber from '../../utils/formatDisplayNumber';
import styles from './index.module.css';

function Circle({
  brush,
  color,
  x = 0,
  y,
  dx = 7,
  dy = 0,
  numberOfEvents,
  congregatePoint,
  midHeight
}) {
  this.dx = dx;
  this.dy = dy;
  this.radius = Math.log2(5 + numberOfEvents * 15);
  this.x = x;
  this.y = y;
  this.color = color;

  const subtract = Math.random() > 0.5;
  const circleMidHeight = midHeight - this.radius;
  const targetOffset = Math.random() * 20;
  this.targetY = subtract
    ? circleMidHeight - targetOffset
    : circleMidHeight + targetOffset;

  this.draw = function() {
    brush.beginPath();
    brush.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    brush.strokeStyle = this.color;
    brush.fillStyle = this.color;
    brush.fill();
    brush.stroke();
  };

  this.onScreen = function(canvasWidth) {
    if (this.x + this.radius > canvasWidth) {
      return false;
    }
    return true;
  };

  this.update = function() {
    this.x += this.dx;

    if (this.x > congregatePoint) {
      if (this.y !== this.targetY && Math.abs(this.y - this.targetY) > 15) {
        if (this.y > this.targetY) {
          this.y = this.y - (this.x - congregatePoint) * 0.06;
        } else {
          this.y = this.y + (this.x - congregatePoint) * 0.06;
        }
      }
    } else {
      this.y += this.dy;
    }

    this.draw();
  };
}

export default class Canvas extends Component {
  constructor(props) {
    super(props);
    this.props = props;
    this.canvasRef = React.createRef();
    this.circles = [];
    this.updateAnimationState = this.updateAnimationState.bind(this);

    const canvasWidth = window.innerWidth * 0.75;
    const canvasHeight = window.innerHeight - 60;
    const dpr = window.devicePixelRatio || 1;
    const canvasScaledWidth = canvasWidth * dpr;
    const canvasScaledHeight = canvasHeight * dpr;

    this.state = {
      canvasWidth,
      canvasHeight,
      congregatePoint: canvasWidth * 0.5,
      midHeight: canvasHeight / 2,
      dpr: dpr,
      dx: (canvasWidth > 1500 ? 10 + (canvasWidth / 500) * (dpr >= 2 ? dpr * 0.6 : 1) : 10),
      canvasScaledWidth,
      canvasScaledHeight
    };

    window.addEventListener('resize', () => {
      this.setState({
        canvasWidth: window.innerWidth * 0.75,
        canvasHeight: window.innerHeight - 60
      });
    });
  }

  updateAnimationState() {
    const canvas = this.canvasRef.current;
    const brush = canvas.getContext('2d');

    brush.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < this.circles.length; i++) {
      if (this.circles[i]) {
        this.circles[i].update();
      }
    }

    this.circles = this.circles.filter(circle => {
      return circle.onScreen(canvas.width);
    });

    this.rAF = requestAnimationFrame(this.updateAnimationState);
  }

  componentDidMount() {
    const { dpr, canvasScaledWidth, canvasScaledHeight } = this.state;
    const canvas = this.canvasRef.current;
    canvas.width = canvasScaledWidth;
    canvas.height = canvasScaledHeight;
    const brush = canvas.getContext('2d');
    brush.scale(dpr, dpr);
    this.rAF = requestAnimationFrame(this.updateAnimationState);
  }

  componentWillUnmount() {
    cancelAnimationFrame(this.rAF);
  }

  componentDidUpdate() {
    const { canvasHeight, congregatePoint, midHeight, dx } = this.state;
    const canvas = this.canvasRef.current;
    const brush = canvas.getContext('2d');

    Object.entries(this.props.events).forEach(({ 1: value }, index) => {
      // Dynamically set circle vertical position based on canvas height and number of event types
      if (value.increment > 0) {
        const circleY =
          (canvasHeight / (Object.keys(this.props.events).length + 1)) *
          (index + 1);

        this.circles.push(
          new Circle({
            brush,
            color: value.color,
            y: circleY,
            numberOfEvents: value.increment,
            congregatePoint,
            midHeight,
            dx
          })
        );
      }
    });
  }

  render() {
    const { totalCount, totalEventsPerSecond } = this.props;
    const { canvasWidth, canvasHeight } = this.state;

    return (
      <div className={styles.canvasContainer}>
        <div className={styles.counter}>
          <span className={styles.totalCount}>
            {formatDisplayNumber(totalCount)}
          </span>
          <span>{formatDisplayNumber(totalEventsPerSecond)}/s</span>
        </div>
        <canvas
          className={styles.canvas}
          style={{ width: canvasWidth, height: canvasHeight }}
          ref={this.canvasRef}
        />
      </div>
    );
  }
}

Canvas.propTypes = {
  events: PropTypes.shape({}).isRequired,
  totalCount: PropTypes.number.isRequired,
  totalEventsPerSecond: PropTypes.number.isRequired
};
