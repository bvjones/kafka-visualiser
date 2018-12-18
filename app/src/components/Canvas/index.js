import React, { Component } from "react";
import PropTypes from 'prop-types';

function Circle(brush, x = 0, y = 150, dx = 5, dy = 0) {
  this.x = x;
  this.y = y;
  this.dx = dx;
  this.dy = dy;
  this.radius = 5;
  this.color = '#FFA500';

  this.draw = function () {
    brush.beginPath()
    brush.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false)
    brush.strokeStyle = this.color;
    brush.fillStyle = this.color
    brush.fill()
    brush.stroke()
  }

  //reverse the x or y coordinates when the circle touches the side
  this.onScreen = function(canvasWidth) {
    if (this.x + this.radius > canvasWidth) {
      return false;
    }
    return true;
  }

  this.update = function () {
    this.x += this.dx
    this.y += this.dy

    this.draw()
  }
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

    brush.clearRect(0, 0, 1500, 300);

    for (let i = 0; i < this.circles.length; i++){
      if (this.circles[i]) {
        this.circles[i].update();
      }
    }

    this.circles = this.circles.filter((circle) => {
      return circle.onScreen(canvas.width);
    })

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

    Object.entries(this.props.events).forEach(({ 1: value}) => {
      let i;

      for(i = 0; i < value.increment; i++) {
        this.circles.push(new Circle(brush))
      }
    });

    console.log(this.circles.length);
  }

  render() {
    return <canvas width = "1500"
    height = "300"
    ref = { this.canvasRef }
    />
  }
}

Canvas.propTypes = {
  events: PropTypes.shape({}).isRequired,
}
