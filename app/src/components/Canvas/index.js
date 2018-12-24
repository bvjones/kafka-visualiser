import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './index.module.css';

function Circle({
  brush,
  color,
  x = 0,
  y = 150,
  dx = 5,
  dy = 0,
  numberOfEvents,
  congregatePoint,
  midHeight
}) {
  this.x = x;
  this.y = y;
  this.dx = dx;
  this.dy = dy;
  this.radius = Math.log2(5 + numberOfEvents * 15);
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
      if (this.y !== this.targetY && Math.abs(this.y - this.targetY) > 5) {
        if (this.y > this.targetY) {
          this.y = this.y - (this.x - congregatePoint) * 0.02;
        } else {
          this.y = this.y + (this.x - congregatePoint) * 0.02;
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
    this.canvasRef = React.createRef();
    this.circles = [];

    this.updateAnimationState = this.updateAnimationState.bind(this);
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
    this.rAF = requestAnimationFrame(this.updateAnimationState);
  }

  componentWillUnmount() {
    cancelAnimationFrame(this.rAF);
  }

  componentDidUpdate() {
    const canvas = this.canvasRef.current;
    const brush = canvas.getContext('2d');

    const congregatePoint = canvas.width * 0.6;
    const midHeight = canvas.height / 2;

    Object.entries(this.props.events).forEach(({ 1: value }, index) => {
      // Dynamically set circle vertical position based on canvas height and number of event types

      if (value.increment > 0) {
        const circleY =
          (canvas.height / (Object.keys(this.props.events).length + 1)) *
          (index + 1);

        this.circles.push(
          new Circle({
            brush,
            color: value.color,
            y: circleY,
            numberOfEvents: value.increment,
            congregatePoint,
            midHeight
          })
        );
      }
    });
  }

  render() {
    const canvasWidth = window.innerWidth * 0.7;
    const canvasHeight = window.innerHeight - 60;

    return (
      <div className={styles.canvasContainer}>
        <canvas
        className={styles.canvas}
          width={canvasWidth}
          height={canvasHeight}
          ref={this.canvasRef}
        />
      </div>
    );
  }
}

Canvas.propTypes = {
  events: PropTypes.shape({}).isRequired
};
