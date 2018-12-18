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
    brush.strokeStyle = 'black'
    brush.fillStyle = this.color
    brush.fill()
    brush.stroke()
  }

  //reverse the x or y coordinates when the circle touches the side
  this.update = function () {
    // if (this.x + this.radius > innerWidth || this.x - this.radius < 0) {
    //   this.dx = -this.dx
    // }
    // if (this.y + this.radius > innerHeight || this.y - this.radius < 0) {
    //   this.dy = -this.dy
    // }
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
